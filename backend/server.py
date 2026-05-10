from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import uuid
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'no-reply@revengearc.com')
SENDER_NAME = os.environ.get('SENDER_NAME', 'Revenge Arc')
SUPPORT_EMAIL = os.environ.get('SUPPORT_EMAIL', 'Revengearchelp@gmail.com')
FROM_FIELD = f"{SENDER_NAME} <{SENDER_EMAIL}>"
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'changeme')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', '').lower().strip()
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'admin-token')
BROADCAST_CONCURRENCY = int(os.environ.get('BROADCAST_CONCURRENCY', '8'))

INSTAGRAM_URL = "https://www.instagram.com/therevenge_arc/"
TIKTOK_URL = "https://www.tiktok.com/@therevenge_arc"
DISCORD_URL = "https://discord.gg/p95MCTsG"

app = FastAPI(title="Revenge Arc API")
api_router = APIRouter(prefix="/api")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ============== MODELS ==============

class WaitlistCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    fitness_goal: str = Field(..., min_length=1, max_length=200)
    device_type: Literal["iPhone", "Android"]
    instagram: Optional[str] = Field(default="", max_length=80)
    tiktok: Optional[str] = Field(default="", max_length=80)


class WaitlistEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    full_name: str
    email: str
    fitness_goal: str
    device_type: str
    instagram: Optional[str] = ""
    tiktok: Optional[str] = ""
    created_at: str


class CreatorCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=4, max_length=40)
    instagram: Optional[str] = Field(default="", max_length=80)
    tiktok: Optional[str] = Field(default="", max_length=80)
    why_support: str = Field(..., min_length=1, max_length=2000)
    desired_pay: str = Field(..., min_length=1, max_length=300)
    audience: str = Field(..., min_length=1, max_length=2000)

    @field_validator("instagram", "tiktok", mode="before")
    @classmethod
    def strip_str(cls, v):
        return (v or "").strip()


class CreatorEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    full_name: str
    email: str
    phone: str
    instagram: Optional[str] = ""
    tiktok: Optional[str] = ""
    why_support: str
    desired_pay: str
    audience: str
    status: str
    created_at: str


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class Announcement(BaseModel):
    subject: str = Field(..., min_length=1, max_length=200)
    html_content: str = Field(..., min_length=1)
    recipient_group: Literal[
        "waitlist", "creator_applicants", "approved_creators",
        "everyone", "iphone_users", "android_users", "custom"
    ] = "waitlist"
    custom_recipients: List[EmailStr] = Field(default_factory=list)


class CreatorEmail(BaseModel):
    subject: str = Field(..., min_length=1, max_length=200)
    html_content: str = Field(..., min_length=1)


class TemplateCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    subject: str = Field(..., min_length=1, max_length=200)
    html_content: str = Field(..., min_length=1)


class Template(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    subject: str
    html_content: str
    created_at: str
    updated_at: str


class SignatureCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    html_content: str = Field(..., min_length=1)


class Signature(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    html_content: str
    created_at: str
    updated_at: str


class BulkDelete(BaseModel):
    ids: List[str] = Field(default_factory=list)
    confirmation: str


class DeleteAll(BaseModel):
    confirmation: str


class StatusChange(BaseModel):
    status: Literal["pending", "approved", "rejected"]


# ============== AUTH ==============

def require_admin(authorization: Optional[str] = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing admin token")
    token = authorization.split(" ", 1)[1].strip()
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid admin token")
    return True


# ============== EMAIL ==============

def _wrap_email(title: str, body_html: str, accent: str = "#a855f7") -> str:
    return f"""\
<!DOCTYPE html>
<html lang="en" style="background:#05050a;">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="dark only">
  <meta name="supported-color-schemes" content="dark only">
  <title>Revenge Arc</title>
  <style>
    :root {{ color-scheme: dark only; supported-color-schemes: dark only; }}
    body, table, td, p, a, h1, h2, h3, span, div {{ -webkit-font-smoothing:antialiased; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }}
    img {{ -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }}
    a {{ text-decoration:none; }}
    @media (prefers-color-scheme: dark) {{
      .ra-bg {{ background:#05050a !important; }}
      .ra-card {{ background:#0a0814 !important; }}
      .ra-card-top {{ background:#0b0b14 !important; }}
      .ra-heading, .ra-strong {{ color:#ffffff !important; }}
      .ra-body {{ color:#cfcfe5 !important; }}
      .ra-muted {{ color:#7a7a96 !important; }}
      .ra-accent, .ra-link {{ color:{accent} !important; }}
    }}
    [data-ogsc] .ra-card {{ background:#0a0814 !important; }}
    [data-ogsc] .ra-card-top {{ background:#0b0b14 !important; }}
    [data-ogsc] .ra-heading, [data-ogsc] .ra-strong {{ color:#ffffff !important; }}
    [data-ogsc] .ra-body {{ color:#cfcfe5 !important; }}
    [data-ogsc] .ra-muted {{ color:#7a7a96 !important; }}
    [data-ogsc] .ra-accent, [data-ogsc] .ra-link {{ color:{accent} !important; }}
    [data-ogsb] .ra-card {{ background:#0a0814 !important; }}
    @media only screen and (max-width: 600px) {{
      .ra-outer {{ padding:18px 10px !important; }}
      .ra-card {{ border-radius:14px !important; }}
      .ra-pad {{ padding:22px 18px !important; }}
      .ra-pad-bottom {{ padding:18px 18px 22px !important; }}
      .ra-heading {{ font-size:21px !important; line-height:1.25 !important; }}
      .ra-body {{ font-size:15px !important; line-height:1.7 !important; }}
      .ra-soc-pill {{ display:inline-block !important; margin:4px 3px !important; padding:7px 11px !important; font-size:10px !important; }}
    }}
  </style>
  <!--[if mso]><style>body, table, td {{ font-family: Arial, Helvetica, sans-serif !important; }}</style><![endif]-->
</head>
<body class="ra-bg" style="margin:0;padding:0;background:#05050a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#05050a;opacity:0;">{title}</div>
  <table role="presentation" class="ra-bg" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#05050a" style="background:#05050a;">
    <tr><td class="ra-outer" align="center" style="padding:36px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="ra-card" bgcolor="#0a0814"
        style="max-width:600px;width:100%;background-color:#0a0814;border:1px solid rgba(168,85,247,0.30);border-radius:18px;overflow:hidden;">
        <tr><td class="ra-card-top ra-pad" bgcolor="#0b0b14" style="background-color:#0b0b14;padding:26px 30px;border-bottom:1px solid rgba(168,85,247,0.18);">
          <div class="ra-accent" style="font-size:13px;letter-spacing:6px;color:{accent};text-transform:uppercase;font-weight:700;">REVENGE ARC</div>
          <div class="ra-heading" style="font-size:24px;color:#ffffff;margin-top:6px;font-weight:800;line-height:1.25;">{title}</div>
        </td></tr>
        <tr><td class="ra-pad ra-body" bgcolor="#0a0814" style="background-color:#0a0814;padding:26px 30px;color:#cfcfe5;font-size:15px;line-height:1.7;">
          {body_html}
        </td></tr>
        <tr><td class="ra-pad-bottom" bgcolor="#0a0814" style="background-color:#0a0814;padding:22px 30px 26px;border-top:1px solid rgba(168,85,247,0.18);">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="padding-bottom:14px;">
              <a href="{INSTAGRAM_URL}" class="ra-soc-pill" style="text-decoration:none;display:inline-block;margin:0 5px;padding:8px 14px;background-color:rgba(236,72,153,0.14);border:1px solid rgba(236,72,153,0.40);border-radius:999px;color:#f9a8d4;font-size:11px;font-weight:700;letter-spacing:2px;">INSTAGRAM</a>
              <a href="{TIKTOK_URL}" class="ra-soc-pill" style="text-decoration:none;display:inline-block;margin:0 5px;padding:8px 14px;background-color:rgba(34,211,238,0.14);border:1px solid rgba(34,211,238,0.40);border-radius:999px;color:#67e8f9;font-size:11px;font-weight:700;letter-spacing:2px;">TIKTOK</a>
              <a href="{DISCORD_URL}" class="ra-soc-pill" style="text-decoration:none;display:inline-block;margin:0 5px;padding:8px 14px;background-color:rgba(168,85,247,0.14);border:1px solid rgba(168,85,247,0.40);border-radius:999px;color:#c4b5fd;font-size:11px;font-weight:700;letter-spacing:2px;">DISCORD</a>
            </td></tr>
            <tr><td class="ra-muted" style="color:#7a7a96;font-size:12px;line-height:1.6;text-align:center;">
              You're receiving this because you joined the Revenge Arc movement.<br>
              Need help? <a class="ra-link" href="mailto:{SUPPORT_EMAIL}" style="color:{accent};text-decoration:none;">{SUPPORT_EMAIL}</a><br>
              <span class="ra-accent" style="color:{accent};font-weight:700;letter-spacing:3px;">THEREVENGE_ARC</span> &middot; Built for warriors.
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>
"""


async def _log_email(*, to: str, subject: str, audience: str = "single", status: str = "sent", error: Optional[str] = None, resend_id: Optional[str] = None):
    """Persist a single email send record for tracking + audit."""
    doc = {
        "id": str(uuid.uuid4()),
        "to": to,
        "subject": subject,
        "audience": audience,
        "status": status,
        "error": error or "",
        "resend_id": resend_id or "",
        "sent_at": datetime.now(timezone.utc).isoformat(),
    }
    try:
        await db.email_logs.insert_one(doc)
    except Exception as e:
        logger.warning(f"email_log insert failed: {e}")


async def send_email_async(to: str, subject: str, html: str, audience: str = "single"):
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not configured; skipping email to %s", to)
        await _log_email(to=to, subject=subject, audience=audience, status="skipped", error="RESEND_API_KEY not configured")
        return None
    params = {"from": FROM_FIELD, "to": [to], "subject": subject, "html": html}
    try:
        res = await asyncio.to_thread(resend.Emails.send, params)
        rid = ""
        if isinstance(res, dict):
            rid = res.get("id") or ""
        await _log_email(to=to, subject=subject, audience=audience, status="sent", resend_id=rid)
        return res
    except Exception as e:
        logger.error(f"Resend send failed for {to}: {e}")
        await _log_email(to=to, subject=subject, audience=audience, status="failed", error=str(e)[:500])
        return None


# ============== ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "Revenge Arc API online", "version": "2.0.0", "sender": SENDER_EMAIL}


@api_router.get("/config/public")
async def public_config():
    return {"support_email": SUPPORT_EMAIL}


# ----- Waitlist -----
@api_router.post("/waitlist", response_model=WaitlistEntry)
async def join_waitlist(payload: WaitlistCreate):
    existing = await db.waitlist.find_one({"email": payload.email.lower()}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=409, detail="This email is already on the waitlist.")
    entry = WaitlistEntry(
        id=str(uuid.uuid4()),
        full_name=payload.full_name.strip(),
        email=payload.email.lower(),
        fitness_goal=payload.fitness_goal.strip(),
        device_type=payload.device_type,
        instagram=(payload.instagram or "").strip(),
        tiktok=(payload.tiktok or "").strip(),
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    await db.waitlist.insert_one(entry.model_dump())
    body = """
      <p>Your revenge arc starts now.</p>
      <p>You officially joined the waitlist for <strong class="ra-strong" style="color:#fff;">Revenge Arc</strong>.</p>
      <p>This app was built for people chasing improvement — in the gym, mentally, physically, and in everyday life.</p>
      <p>We created Revenge Arc because most fitness apps today feel incomplete. Too many subscriptions. Too many missing features. So we built one platform that combines everything together with powerful AI tools and tracking systems.</p>
      <p>You'll be one of the first people to get notified when early access launches.</p>
      <div style="margin-top:18px;padding:16px 18px;border:1px solid rgba(168,85,247,0.30);border-radius:12px;background-color:rgba(168,85,247,0.08);">
        <div class="ra-accent" style="color:#a855f7;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">EXPECT</div>
        <ul style="margin:10px 0 0;padding-left:20px;line-height:1.7;color:#cfcfe5;">
          <li>AI-powered fitness tools</li>
          <li>Nutrition &amp; macro tracking</li>
          <li>Workout systems</li>
          <li>Progress analytics</li>
          <li>New updates &amp; exclusive features</li>
          <li>Community-focused improvements</li>
        </ul>
      </div>
      <p style="margin-top:22px;">More updates coming soon.</p>
      <p><strong class="ra-strong" style="color:#fff;">Stay ready.</strong></p>
    """
    await send_email_async(entry.email, "Welcome to Revenge Arc.", _wrap_email("Your revenge arc starts now.", body, "#a855f7"))
    return entry


# ----- Creator Application -----
@api_router.post("/creator-applications", response_model=CreatorEntry)
async def apply_creator(payload: CreatorCreate):
    if not (payload.instagram.strip() or payload.tiktok.strip()):
        raise HTTPException(status_code=422, detail="Instagram or TikTok handle is required (at least one).")
    existing = await db.creators.find_one({"email": payload.email.lower()}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=409, detail="This email has already been used for a creator application.")
    entry = CreatorEntry(
        id=str(uuid.uuid4()),
        full_name=payload.full_name.strip(),
        email=payload.email.lower(),
        phone=payload.phone.strip(),
        instagram=payload.instagram.strip(),
        tiktok=payload.tiktok.strip(),
        why_support=payload.why_support.strip(),
        desired_pay=payload.desired_pay.strip(),
        audience=payload.audience.strip(),
        status="pending",
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    await db.creators.insert_one(entry.model_dump())
    body = """
      <p>Thank you for applying to the <strong class="ra-strong" style="color:#fff;">Revenge Arc Creator Program</strong>. We appreciate you taking the time to submit your information and wanting to be part of what we're building.</p>
      <p>Revenge Arc is more than just a fitness app — it's a platform focused on discipline, progression, self-improvement, and helping people become the best version of themselves through powerful AI tools and systems.</p>
      <p>Your application has been received and will now go through a manual review process by our team.</p>
      <div style="margin-top:18px;padding:16px 18px;border:1px solid rgba(245,158,11,0.30);border-radius:12px;background-color:rgba(245,158,11,0.08);">
        <div class="ra-accent" style="color:#f59e0b;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">IF SELECTED, WE'LL REACH BACK OUT WITH</div>
        <ul style="margin:10px 0 0;padding-left:20px;line-height:1.7;color:#cfcfe5;">
          <li>next steps</li>
          <li>creator access</li>
          <li>partnership details</li>
          <li>compensation discussion</li>
          <li>how the program will work moving forward</li>
        </ul>
      </div>
      <p style="margin-top:22px;">We're looking for creators who genuinely align with the mindset and vision behind Revenge Arc, and we appreciate everyone showing support early.</p>
      <p><strong class="ra-strong" style="color:#fff;">More updates soon.</strong></p>
    """
    await send_email_async(entry.email, "Your Revenge Arc creator application was received.", _wrap_email("You're officially in review.", body, "#f59e0b"))
    return entry


# ----- Admin Auth -----
@api_router.post("/admin/login")
async def admin_login(payload: AdminLogin):
    email_match = (not ADMIN_EMAIL) or (payload.email.lower().strip() == ADMIN_EMAIL)
    if not email_match or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"token": ADMIN_TOKEN}


# ----- Stats with time-range -----
RANGE_MAP = {
    "24h": (1, "hour", 24),
    "2d":  (2, "day", 2),
    "7d":  (7, "day", 7),
    "14d": (14, "day", 14),
    "30d": (30, "day", 30),
    "3mo": (90, "week", 12),
    "6mo": (180, "week", 24),
    "1y":  (365, "month", 12),
}


def _bucket_starts(range_key: str):
    """Return list of (start_dt, end_dt, label) buckets covering the range."""
    now = datetime.now(timezone.utc)
    days_back, unit, count = RANGE_MAP.get(range_key, RANGE_MAP["14d"])
    buckets = []
    if unit == "hour":
        end = now.replace(minute=0, second=0, microsecond=0) + timedelta(hours=1)
        for i in range(count - 1, -1, -1):
            s = end - timedelta(hours=i + 1)
            e = end - timedelta(hours=i)
            buckets.append((s, e, s.strftime("%Hh")))
    elif unit == "day":
        today = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
        for i in range(count - 1, -1, -1):
            s = today - timedelta(days=i)
            e = s + timedelta(days=1)
            buckets.append((s, e, s.strftime("%b %d")))
    elif unit == "week":
        end = now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
        for i in range(count - 1, -1, -1):
            s = end - timedelta(weeks=i + 1)
            e = end - timedelta(weeks=i)
            buckets.append((s, e, s.strftime("%b %d")))
    else:  # month
        # 12 months back
        cur = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
        months = []
        for _ in range(count):
            months.append(cur)
            y = cur.year - (1 if cur.month == 1 else 0)
            m = 12 if cur.month == 1 else cur.month - 1
            cur = datetime(y, m, 1, tzinfo=timezone.utc)
        months.reverse()
        for i, s in enumerate(months):
            if i + 1 < len(months):
                e = months[i + 1]
            else:
                # next month
                y = s.year + (1 if s.month == 12 else 0)
                m = 1 if s.month == 12 else s.month + 1
                e = datetime(y, m, 1, tzinfo=timezone.utc)
            buckets.append((s, e, s.strftime("%b %y")))
    return buckets


@api_router.get("/admin/stats")
async def admin_stats(
    range: str = Query("14d", pattern="^(24h|2d|7d|14d|30d|3mo|6mo|1y)$"),
    _=Depends(require_admin),
):
    total_waitlist = await db.waitlist.count_documents({})
    total_creators = await db.creators.count_documents({})
    pending = await db.creators.count_documents({"status": "pending"})
    approved = await db.creators.count_documents({"status": "approved"})
    rejected = await db.creators.count_documents({"status": "rejected"})

    buckets = _bucket_starts(range)
    growth = []
    for s, e, label in buckets:
        s_iso = s.isoformat()
        e_iso = e.isoformat()
        wl = await db.waitlist.count_documents({"created_at": {"$gte": s_iso, "$lt": e_iso}})
        cr = await db.creators.count_documents({"created_at": {"$gte": s_iso, "$lt": e_iso}})
        growth.append({"label": label, "date": s.isoformat(), "waitlist": wl, "creators": cr})

    seven = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    recent_w = await db.waitlist.count_documents({"created_at": {"$gte": seven}})
    recent_c = await db.creators.count_documents({"created_at": {"$gte": seven}})

    iphone = await db.waitlist.count_documents({"device_type": "iPhone"})
    android = await db.waitlist.count_documents({"device_type": "Android"})

    return {
        "total_waitlist": total_waitlist,
        "total_creators": total_creators,
        "pending_creators": pending,
        "approved_creators": approved,
        "rejected_creators": rejected,
        "recent_waitlist_7d": recent_w,
        "recent_creators_7d": recent_c,
        "growth": growth,
        "range": range,
        "device_split": {"iPhone": iphone, "Android": android},
    }


# ----- Waitlist & Creators (admin) -----

@api_router.get("/admin/waitlist", response_model=List[WaitlistEntry])
async def admin_get_waitlist(_=Depends(require_admin)):
    rows = await db.waitlist.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    return rows


@api_router.delete("/admin/waitlist/{entry_id}")
async def admin_delete_waitlist(entry_id: str, _=Depends(require_admin)):
    res = await db.waitlist.delete_one({"id": entry_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"deleted": True}


@api_router.get("/admin/creators", response_model=List[CreatorEntry])
async def admin_get_creators(
    status: Optional[str] = Query(default=None, pattern="^(pending|approved|rejected)$"),
    _=Depends(require_admin),
):
    q = {"status": status} if status else {}
    rows = await db.creators.find(q, {"_id": 0}).sort("created_at", -1).to_list(5000)
    return rows


@api_router.post("/admin/creators/{creator_id}/approve")
async def approve_creator(creator_id: str, _=Depends(require_admin)):
    creator = await db.creators.find_one({"id": creator_id}, {"_id": 0})
    if not creator:
        raise HTTPException(status_code=404, detail="Not found")
    await db.creators.update_one({"id": creator_id}, {"$set": {"status": "approved"}})
    body = f"""
      <p>Hey <strong style="color:#fff">{creator['full_name']}</strong>,</p>
      <p>Welcome to the <strong style="color:#22c55e">Revenge Arc Creator Program</strong>. You've officially been approved.</p>
      <p>Our team will reach out shortly with next steps, brand assets, and your creator agreement.</p>
      <div style="margin-top:24px;padding:16px 18px;border:1px solid rgba(34,197,94,0.3);border-radius:12px;background:rgba(34,197,94,0.06);">
        <div style="color:#22c55e;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">APPROVED</div>
        <div style="color:#fff;margin-top:6px;">You're officially part of the movement.</div>
      </div>
    """
    await send_email_async(creator['email'], "Revenge Arc — Creator Application Approved", _wrap_email("You're in.", body, "#22c55e"))
    return {"status": "approved"}


@api_router.post("/admin/creators/{creator_id}/reject")
async def reject_creator(creator_id: str, _=Depends(require_admin)):
    creator = await db.creators.find_one({"id": creator_id}, {"_id": 0})
    if not creator:
        raise HTTPException(status_code=404, detail="Not found")
    await db.creators.update_one({"id": creator_id}, {"$set": {"status": "rejected"}})
    body = f"""
      <p>Hey <strong style="color:#fff">{creator['full_name']}</strong>,</p>
      <p>Thanks for applying to the Revenge Arc Creator Program. After careful review, we won't be moving forward with your application at this time.</p>
      <p>Keep building your audience. The arc never ends — you can re-apply in the future.</p>
    """
    await send_email_async(creator['email'], "Revenge Arc — Creator Application Update", _wrap_email("Application update.", body, "#ef4444"))
    return {"status": "rejected"}


@api_router.post("/admin/creators/{creator_id}/email")
async def email_creator(creator_id: str, payload: CreatorEmail, _=Depends(require_admin)):
    creator = await db.creators.find_one({"id": creator_id}, {"_id": 0})
    if not creator:
        raise HTTPException(status_code=404, detail="Not found")
    res = await send_email_async(creator['email'], payload.subject, _wrap_email(payload.subject, payload.html_content, "#a855f7"))
    return {"sent": bool(res)}


# ----- Recipient counts & broadcast -----

async def _collect_recipients(group: str, custom: Optional[List[str]] = None):
    seen = set()
    out = []

    async def _add_from(cursor):
        async for r in cursor:
            email = (r.get("email") or "").lower()
            if email and email not in seen:
                seen.add(email)
                out.append({"email": email, "full_name": r.get("full_name") or "warrior"})

    if group == "waitlist":
        await _add_from(db.waitlist.find({}, {"_id": 0, "email": 1, "full_name": 1}))
    elif group == "creator_applicants":
        await _add_from(db.creators.find({}, {"_id": 0, "email": 1, "full_name": 1}))
    elif group == "approved_creators":
        await _add_from(db.creators.find({"status": "approved"}, {"_id": 0, "email": 1, "full_name": 1}))
    elif group == "iphone_users":
        await _add_from(db.waitlist.find({"device_type": "iPhone"}, {"_id": 0, "email": 1, "full_name": 1}))
    elif group == "android_users":
        await _add_from(db.waitlist.find({"device_type": "Android"}, {"_id": 0, "email": 1, "full_name": 1}))
    elif group == "everyone":
        await _add_from(db.waitlist.find({}, {"_id": 0, "email": 1, "full_name": 1}))
        await _add_from(db.creators.find({}, {"_id": 0, "email": 1, "full_name": 1}))
    elif group == "custom":
        for raw in (custom or []):
            email = (raw or "").strip().lower()
            if email and email not in seen and "@" in email:
                seen.add(email)
                out.append({"email": email, "full_name": "warrior"})
    return out


@api_router.get("/admin/recipient-counts")
async def admin_recipient_counts(_=Depends(require_admin)):
    waitlist = await db.waitlist.count_documents({})
    creator_applicants = await db.creators.count_documents({})
    approved_creators = await db.creators.count_documents({"status": "approved"})
    iphone = await db.waitlist.count_documents({"device_type": "iPhone"})
    android = await db.waitlist.count_documents({"device_type": "Android"})
    everyone = await _collect_recipients("everyone")
    return {
        "waitlist": waitlist,
        "creator_applicants": creator_applicants,
        "approved_creators": approved_creators,
        "iphone_users": iphone,
        "android_users": android,
        "everyone": len(everyone),
    }


@api_router.post("/admin/announce")
async def admin_announce(payload: Announcement, _=Depends(require_admin)):
    recipients = await _collect_recipients(payload.recipient_group, payload.custom_recipients)
    if payload.recipient_group == "custom" and not recipients:
        raise HTTPException(status_code=422, detail="No valid custom recipients provided.")

    semaphore = asyncio.Semaphore(BROADCAST_CONCURRENCY)

    async def _one(r):
        async with semaphore:
            body = f"<p>Hey <strong style=\"color:#fff\">{r['full_name']}</strong>,</p>" + payload.html_content
            res = await send_email_async(
                r['email'], payload.subject,
                _wrap_email(payload.subject, body, "#a855f7"),
                audience=payload.recipient_group,
            )
            return (r['email'], bool(res))

    results = await asyncio.gather(*[_one(r) for r in recipients], return_exceptions=True)
    sent = 0
    failed = 0
    failures = []
    for item in results:
        if isinstance(item, Exception):
            failed += 1
            continue
        email, ok = item
        if ok:
            sent += 1
        else:
            failed += 1
            failures.append(email)
    return {
        "sent": sent,
        "failed": failed,
        "total": len(recipients),
        "group": payload.recipient_group,
        "failed_emails": failures[:5],
        "concurrency": BROADCAST_CONCURRENCY,
    }


# ----- Email Templates -----

@api_router.get("/admin/templates", response_model=List[Template])
async def list_templates(_=Depends(require_admin)):
    rows = await db.templates.find({}, {"_id": 0}).sort("updated_at", -1).to_list(500)
    return rows


@api_router.post("/admin/templates", response_model=Template)
async def create_template(payload: TemplateCreate, _=Depends(require_admin)):
    now = datetime.now(timezone.utc).isoformat()
    t = Template(
        id=str(uuid.uuid4()),
        name=payload.name.strip(),
        subject=payload.subject.strip(),
        html_content=payload.html_content,
        created_at=now,
        updated_at=now,
    )
    await db.templates.insert_one(t.model_dump())
    return t


@api_router.put("/admin/templates/{template_id}", response_model=Template)
async def update_template(template_id: str, payload: TemplateCreate, _=Depends(require_admin)):
    existing = await db.templates.find_one({"id": template_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Template not found")
    update = {
        "name": payload.name.strip(),
        "subject": payload.subject.strip(),
        "html_content": payload.html_content,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.templates.update_one({"id": template_id}, {"$set": update})
    existing.update(update)
    return existing


@api_router.delete("/admin/templates/{template_id}")
async def delete_template(template_id: str, _=Depends(require_admin)):
    res = await db.templates.delete_one({"id": template_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"deleted": True}


# ----- Email Signatures -----

DEFAULT_SIGNATURE_HTML = """\
<div style="margin-top:28px;padding-top:18px;border-top:1px solid rgba(168,85,247,0.18);color:#a8a8c2;font-size:14px;line-height:1.6;">
  — The Revenge Arc Team<br>
  <span style="color:#7a7a96;font-size:12px;letter-spacing:2px;">DISCIPLINE BUILT DIFFERENT.</span><br>
  <span style="color:#7a7a96;font-size:12px;">therevenge_arc</span>
</div>"""


async def _ensure_default_signature():
    existing = await db.signatures.find_one({"name": "Revenge Arc Original"}, {"_id": 0})
    if not existing:
        now = datetime.now(timezone.utc).isoformat()
        sig = Signature(
            id=str(uuid.uuid4()),
            name="Revenge Arc Original",
            html_content=DEFAULT_SIGNATURE_HTML,
            created_at=now,
            updated_at=now,
        )
        await db.signatures.insert_one(sig.model_dump())


@api_router.get("/admin/signatures", response_model=List[Signature])
async def list_signatures(_=Depends(require_admin)):
    await _ensure_default_signature()
    rows = await db.signatures.find({}, {"_id": 0}).sort("updated_at", -1).to_list(500)
    return rows


@api_router.post("/admin/signatures", response_model=Signature)
async def create_signature(payload: SignatureCreate, _=Depends(require_admin)):
    name = payload.name.strip()
    if await db.signatures.find_one({"name": name}, {"_id": 0}):
        raise HTTPException(status_code=409, detail=f"A signature named '{name}' already exists.")
    now = datetime.now(timezone.utc).isoformat()
    sig = Signature(
        id=str(uuid.uuid4()),
        name=name,
        html_content=payload.html_content,
        created_at=now,
        updated_at=now,
    )
    await db.signatures.insert_one(sig.model_dump())
    return sig


@api_router.put("/admin/signatures/{signature_id}", response_model=Signature)
async def update_signature(signature_id: str, payload: SignatureCreate, _=Depends(require_admin)):
    existing = await db.signatures.find_one({"id": signature_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Signature not found")
    name = payload.name.strip()
    name_clash = await db.signatures.find_one({"name": name, "id": {"$ne": signature_id}}, {"_id": 0})
    if name_clash:
        raise HTTPException(status_code=409, detail=f"A signature named '{name}' already exists.")
    update = {
        "name": name,
        "html_content": payload.html_content,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.signatures.update_one({"id": signature_id}, {"$set": update})
    existing.update(update)
    return existing


@api_router.delete("/admin/signatures/{signature_id}")
async def delete_signature(signature_id: str, _=Depends(require_admin)):
    res = await db.signatures.delete_one({"id": signature_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"deleted": True}


# ----- Bulk delete -----

@api_router.post("/admin/waitlist/bulk-delete")
async def bulk_delete_waitlist(payload: BulkDelete, _=Depends(require_admin)):
    if payload.confirmation != "DELETE":
        raise HTTPException(status_code=422, detail="Confirmation must be 'DELETE' (all caps).")
    if not payload.ids:
        return {"deleted": 0}
    res = await db.waitlist.delete_many({"id": {"$in": payload.ids}})
    return {"deleted": res.deleted_count}


@api_router.delete("/admin/waitlist")
async def delete_all_waitlist(payload: DeleteAll, _=Depends(require_admin)):
    if payload.confirmation != "DELETE":
        raise HTTPException(status_code=422, detail="Confirmation must be 'DELETE' (all caps).")
    res = await db.waitlist.delete_many({})
    return {"deleted": res.deleted_count}


@api_router.post("/admin/creators/bulk-delete")
async def bulk_delete_creators(payload: BulkDelete, _=Depends(require_admin)):
    if payload.confirmation != "DELETE":
        raise HTTPException(status_code=422, detail="Confirmation must be 'DELETE' (all caps).")
    if not payload.ids:
        return {"deleted": 0}
    res = await db.creators.delete_many({"id": {"$in": payload.ids}})
    return {"deleted": res.deleted_count}


@api_router.delete("/admin/creators")
async def delete_all_creators(payload: DeleteAll, _=Depends(require_admin)):
    if payload.confirmation != "DELETE":
        raise HTTPException(status_code=422, detail="Confirmation must be 'DELETE' (all caps).")
    res = await db.creators.delete_many({})
    return {"deleted": res.deleted_count}


# ----- Status change -----

@api_router.post("/admin/creators/{creator_id}/status")
async def set_creator_status(creator_id: str, payload: StatusChange, _=Depends(require_admin)):
    existing = await db.creators.find_one({"id": creator_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Not found")
    await db.creators.update_one({"id": creator_id}, {"$set": {"status": payload.status}})
    return {"status": payload.status}


# ----- User search (broadcast custom recipients) -----

@api_router.get("/admin/users/search")
async def search_users(q: str = Query(default="", min_length=0, max_length=120), _=Depends(require_admin)):
    q = (q or "").strip().lower()
    if not q or len(q) < 2:
        return {"results": []}
    seen = set()
    results = []
    pattern = {"$regex": q.replace(".", r"\."), "$options": "i"}

    async def _scan(cursor, source):
        async for r in cursor:
            email = (r.get("email") or "").lower()
            if not email or email in seen:
                continue
            seen.add(email)
            results.append({
                "email": email,
                "full_name": r.get("full_name") or "",
                "instagram": r.get("instagram") or "",
                "tiktok": r.get("tiktok") or "",
                "source": source,
                "status": r.get("status") or "",
            })
            if len(results) >= 20:
                break

    or_clause = [{"email": pattern}, {"full_name": pattern}, {"instagram": pattern}, {"tiktok": pattern}]
    await _scan(db.waitlist.find({"$or": or_clause}, {"_id": 0}).limit(20), "waitlist")
    await _scan(db.creators.find({"$or": or_clause}, {"_id": 0}).limit(20), "creator")
    return {"results": results[:20]}


# ----- Email tracking / logs -----

@api_router.get("/admin/email-logs")
async def admin_email_logs(
    limit: int = Query(default=100, ge=1, le=500),
    status_filter: Optional[str] = Query(default=None, alias="status", pattern="^(sent|failed|skipped)$"),
    audience: Optional[str] = Query(default=None, max_length=60),
    q: Optional[str] = Query(default=None, max_length=200),
    _=Depends(require_admin),
):
    query: dict = {}
    if status_filter:
        query["status"] = status_filter
    if audience:
        query["audience"] = audience
    if q:
        pattern = {"$regex": q.replace(".", r"\."), "$options": "i"}
        query["$or"] = [{"to": pattern}, {"subject": pattern}]
    rows = await db.email_logs.find(query, {"_id": 0}).sort("sent_at", -1).to_list(limit)
    total = await db.email_logs.count_documents({})
    sent_total = await db.email_logs.count_documents({"status": "sent"})
    failed_total = await db.email_logs.count_documents({"status": "failed"})
    return {
        "logs": rows,
        "total": total,
        "sent_total": sent_total,
        "failed_total": failed_total,
    }


@api_router.delete("/admin/email-logs")
async def admin_clear_email_logs(payload: DeleteAll, _=Depends(require_admin)):
    if payload.confirmation != "DELETE":
        raise HTTPException(status_code=422, detail="Confirmation must be 'DELETE' (all caps).")
    res = await db.email_logs.delete_many({})
    return {"deleted": res.deleted_count}


# Mount
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
