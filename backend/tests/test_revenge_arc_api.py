"""Backend test suite for Revenge Arc API."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://arc-preview-2.preview.emergentagent.com").rstrip("/")
ADMIN_PASSWORD = "RevengeArc2026!"


def _email(prefix="user"):
    return f"TEST_{prefix}_{uuid.uuid4().hex[:10]}@example.com"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ===================== Health =====================
class TestHealth:
    def test_root(self, session):
        r = session.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        body = r.json()
        assert "message" in body


# ===================== Waitlist =====================
class TestWaitlist:
    def test_join_happy_path(self, session, admin_headers):
        email = _email("wl_happy")
        payload = {
            "full_name": "TEST Warrior",
            "email": email,
            "fitness_goal": "Cut 20 lbs",
            "device_type": "iPhone",
            "instagram": "@warrior",
            "tiktok": "",
        }
        r = session.post(f"{BASE_URL}/api/waitlist", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str)
        assert "created_at" in data
        assert data["email"] == email.lower()
        assert data["device_type"] == "iPhone"
        assert "_id" not in data

        # Verify persistence via admin endpoint
        r2 = session.get(f"{BASE_URL}/api/admin/waitlist", headers=admin_headers)
        assert r2.status_code == 200
        emails = [e["email"] for e in r2.json()]
        assert email.lower() in emails

    def test_join_duplicate_returns_409(self, session):
        email = _email("wl_dup")
        payload = {
            "full_name": "Dup User",
            "email": email,
            "fitness_goal": "Build muscle",
            "device_type": "Android",
        }
        r1 = session.post(f"{BASE_URL}/api/waitlist", json=payload)
        assert r1.status_code == 200
        r2 = session.post(f"{BASE_URL}/api/waitlist", json=payload)
        assert r2.status_code == 409

    def test_join_invalid_email_returns_422(self, session):
        r = session.post(f"{BASE_URL}/api/waitlist", json={
            "full_name": "Bad Email",
            "email": "not-an-email",
            "fitness_goal": "Run 5k",
            "device_type": "iPhone",
        })
        assert r.status_code == 422

    def test_join_invalid_device_returns_422(self, session):
        r = session.post(f"{BASE_URL}/api/waitlist", json={
            "full_name": "Bad Device",
            "email": _email("baddev"),
            "fitness_goal": "Lose weight",
            "device_type": "Windows",
        })
        assert r.status_code == 422


# ===================== Creator Applications =====================
class TestCreators:
    def test_apply_with_instagram(self, session):
        payload = {
            "full_name": "TEST Creator IG",
            "email": _email("cr_ig"),
            "phone": "+15551234567",
            "instagram": "@creator_ig",
            "tiktok": "",
            "why_support": "I love the brand",
            "compensation_type": "Cash",
            "desired_pay": "$500/post",
            "audience": "100k IG fitness niche",
        }
        r = session.post(f"{BASE_URL}/api/creator-applications", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["status"] == "pending"
        assert d["instagram"] == "@creator_ig"
        assert "id" in d
        assert "_id" not in d

    def test_apply_with_tiktok(self, session):
        payload = {
            "full_name": "TEST Creator TT",
            "email": _email("cr_tt"),
            "phone": "+15551234567",
            "instagram": "",
            "tiktok": "@creator_tt",
            "why_support": "Movement is fire",
            "compensation_type": "Affiliate",
            "desired_pay": "10% rev share",
            "audience": "200k TikTok",
        }
        r = session.post(f"{BASE_URL}/api/creator-applications", json=payload)
        assert r.status_code == 200, r.text
        assert r.json()["tiktok"] == "@creator_tt"

    def test_apply_neither_handle_returns_422(self, session):
        payload = {
            "full_name": "TEST No Social",
            "email": _email("cr_none"),
            "phone": "+15551234567",
            "instagram": "",
            "tiktok": "",
            "why_support": "x",
            "compensation_type": "Cash",
            "desired_pay": "x",
            "audience": "x",
        }
        r = session.post(f"{BASE_URL}/api/creator-applications", json=payload)
        assert r.status_code == 422


# ===================== Admin auth =====================
class TestAdminAuth:
    def test_login_wrong_password(self, session):
        r = session.post(f"{BASE_URL}/api/admin/login", json={"password": "wrong"})
        assert r.status_code == 401

    def test_login_correct_password(self, session):
        r = session.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        assert r.status_code == 200
        assert "token" in r.json()
        assert isinstance(r.json()["token"], str)

    def test_stats_no_auth(self, session):
        r = session.get(f"{BASE_URL}/api/admin/stats")
        assert r.status_code == 401

    def test_stats_with_auth(self, session, admin_headers):
        r = session.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ["total_waitlist", "total_creators", "growth", "device_split"]:
            assert k in d
        assert isinstance(d["growth"], list)
        assert "iPhone" in d["device_split"] and "Android" in d["device_split"]


# ===================== Admin lists & actions =====================
class TestAdminLists:
    def test_get_waitlist(self, session, admin_headers):
        r = session.get(f"{BASE_URL}/api/admin/waitlist", headers=admin_headers)
        assert r.status_code == 200
        rows = r.json()
        assert isinstance(rows, list)
        for row in rows:
            assert "_id" not in row
            assert "id" in row
        # Sorted desc by created_at
        if len(rows) >= 2:
            assert rows[0]["created_at"] >= rows[-1]["created_at"]

    def test_get_creators(self, session, admin_headers):
        r = session.get(f"{BASE_URL}/api/admin/creators", headers=admin_headers)
        assert r.status_code == 200
        rows = r.json()
        assert isinstance(rows, list)
        for row in rows:
            assert "_id" not in row

    def test_approve_creator_flow(self, session, admin_headers):
        # Create a creator
        email = _email("cr_approve")
        payload = {
            "full_name": "TEST Approve Me",
            "email": email,
            "phone": "+15551234567",
            "instagram": "@approveme",
            "why_support": "yes",
            "compensation_type": "Cash",
            "desired_pay": "$500",
            "audience": "10k",
        }
        cr = session.post(f"{BASE_URL}/api/creator-applications", json=payload).json()
        cid = cr["id"]
        # Approve
        r = session.post(f"{BASE_URL}/api/admin/creators/{cid}/approve", headers=admin_headers)
        assert r.status_code == 200
        assert r.json()["status"] == "approved"
        # Verify status persisted
        rows = session.get(f"{BASE_URL}/api/admin/creators", headers=admin_headers).json()
        row = next(r for r in rows if r["id"] == cid)
        assert row["status"] == "approved"

    def test_reject_creator_flow(self, session, admin_headers):
        payload = {
            "full_name": "TEST Reject Me",
            "email": _email("cr_reject"),
            "phone": "+15551234567",
            "tiktok": "@rejectme",
            "why_support": "yes",
            "compensation_type": "Cash",
            "desired_pay": "$500",
            "audience": "10k",
        }
        cr = session.post(f"{BASE_URL}/api/creator-applications", json=payload).json()
        cid = cr["id"]
        r = session.post(f"{BASE_URL}/api/admin/creators/{cid}/reject", headers=admin_headers)
        assert r.status_code == 200
        assert r.json()["status"] == "rejected"

    def test_email_creator(self, session, admin_headers):
        payload = {
            "full_name": "TEST Email Me",
            "email": _email("cr_email"),
            "phone": "+15551234567",
            "instagram": "@emailme",
            "why_support": "yes",
            "compensation_type": "Cash",
            "desired_pay": "$500",
            "audience": "10k",
        }
        cr = session.post(f"{BASE_URL}/api/creator-applications", json=payload).json()
        cid = cr["id"]
        r = session.post(
            f"{BASE_URL}/api/admin/creators/{cid}/email",
            headers=admin_headers,
            json={"subject": "TEST", "html_content": "<p>hi</p>"},
        )
        assert r.status_code == 200
        assert r.json().get("sent") is True

    def test_announce(self, session, admin_headers):
        r = session.post(
            f"{BASE_URL}/api/admin/announce",
            headers=admin_headers,
            json={"subject": "TEST broadcast", "html_content": "<p>hi all</p>"},
        )
        assert r.status_code == 200
        d = r.json()
        for k in ["sent", "failed", "total"]:
            assert k in d

    def test_delete_waitlist(self, session, admin_headers):
        # Create then delete
        email = _email("wl_del")
        payload = {
            "full_name": "TEST Delete",
            "email": email,
            "fitness_goal": "x",
            "device_type": "iPhone",
        }
        wl = session.post(f"{BASE_URL}/api/waitlist", json=payload).json()
        wid = wl["id"]
        r = session.delete(f"{BASE_URL}/api/admin/waitlist/{wid}", headers=admin_headers)
        assert r.status_code == 200
        assert r.json().get("deleted") is True
        # 404 on second delete
        r2 = session.delete(f"{BASE_URL}/api/admin/waitlist/{wid}", headers=admin_headers)
        assert r2.status_code == 404
