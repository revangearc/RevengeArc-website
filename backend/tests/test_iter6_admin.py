"""
Iteration 6 backend tests:
- Admin login with email+password (case-insensitive email)
- Creator duplicate-email guard (case-insensitive, 409)
- Email logs endpoints (GET filters + DELETE confirmation)
- Regression on iter5 endpoints
NOTE: Does NOT trigger /api/admin/announce (Resend quota exhausted).
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
ADMIN_EMAIL = "Revengearchelp@gmail.com"
ADMIN_PASSWORD = "Bashar1212"
API = f"{BASE_URL}/api"


# ---------- Fixtures ----------

@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


def _seed_creator(prefix="TEST6_CR", email=None):
    uid = uuid.uuid4().hex[:8]
    payload = {
        "full_name": f"{prefix} {uid}",
        "email": email or f"{prefix.lower()}_{uid}@example.com",
        "phone": "+15555550000",
        "desired_pay": "TBD",
        "instagram": f"@{prefix.lower()}_{uid}",
        "tiktok": "",
        "why_support": "I align with the discipline-first mindset.",
        "audience": "fitness enthusiasts, 18-30",
    }
    return requests.post(f"{API}/creator-applications", json=payload, timeout=20)


# ---------- Admin Login (iter6 email+password) ----------

class TestAdminLoginV2:
    def test_login_correct_email_and_password(self):
        r = requests.post(f"{API}/admin/login",
                          json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json().get("token"), str)
        assert len(r.json()["token"]) > 0

    def test_login_wrong_email_returns_401(self):
        r = requests.post(f"{API}/admin/login",
                          json={"email": "wrong@example.com", "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 401

    def test_login_wrong_password_returns_401(self):
        r = requests.post(f"{API}/admin/login",
                          json={"email": ADMIN_EMAIL, "password": "wrong-pass"}, timeout=15)
        assert r.status_code == 401

    def test_login_case_insensitive_email(self):
        r = requests.post(f"{API}/admin/login",
                          json={"email": "REVENGEARCHELP@GMAIL.COM", "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200, f"expected 200 for upper-case email; got {r.status_code} {r.text}"

    def test_login_old_single_field_returns_422(self):
        r = requests.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 422


# ---------- Creator duplicate-email guard ----------

class TestCreatorDuplicateEmail:
    def test_first_create_then_dup_returns_409(self, auth_headers):
        uid = uuid.uuid4().hex[:8]
        email = f"test6_dup_{uid}@example.com"
        r1 = _seed_creator(email=email)
        assert r1.status_code == 200, f"first creator should be 200, got {r1.status_code} {r1.text}"
        cid = r1.json()["id"]
        try:
            r2 = _seed_creator(email=email)
            assert r2.status_code == 409
            assert "already" in r2.json().get("detail", "").lower()
        finally:
            requests.post(f"{API}/admin/creators/bulk-delete",
                          headers=auth_headers,
                          json={"ids": [cid], "confirmation": "DELETE"}, timeout=15)

    def test_case_insensitive_duplicate_returns_409(self, auth_headers):
        uid = uuid.uuid4().hex[:8]
        lower_email = f"test6_case_{uid}@example.com"
        upper_email = lower_email.upper()
        r1 = _seed_creator(email=lower_email)
        assert r1.status_code == 200
        cid = r1.json()["id"]
        try:
            r2 = _seed_creator(email=upper_email)
            assert r2.status_code == 409, f"expected 409 for case-different dup; got {r2.status_code}"
        finally:
            requests.post(f"{API}/admin/creators/bulk-delete",
                          headers=auth_headers,
                          json={"ids": [cid], "confirmation": "DELETE"}, timeout=15)


# ---------- Waitlist regression (soft-pass on Resend) ----------

class TestWaitlistRegression:
    def test_waitlist_post_creates_row(self):
        uid = uuid.uuid4().hex[:8]
        payload = {
            "full_name": f"TEST6_WL {uid}",
            "email": f"test6_wl_{uid}@example.com",
            "fitness_goal": "grind",
            "device_type": "iPhone",
        }
        r = requests.post(f"{API}/waitlist", json=payload, timeout=20)
        assert r.status_code == 200
        assert r.json()["email"] == payload["email"]


# ---------- Email Logs ----------

class TestEmailLogs:
    def test_unauthenticated_returns_401(self):
        r = requests.get(f"{API}/admin/email-logs", timeout=15)
        assert r.status_code == 401

    def test_get_email_logs_structure(self, auth_headers):
        r = requests.get(f"{API}/admin/email-logs", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        body = r.json()
        for k in ("logs", "total", "sent_total", "failed_total"):
            assert k in body, f"missing key {k} in response: {list(body.keys())}"
        assert isinstance(body["logs"], list)
        assert isinstance(body["total"], int)

    def test_filter_status_failed(self, auth_headers):
        r = requests.get(f"{API}/admin/email-logs?status=failed", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        for row in r.json()["logs"]:
            assert row["status"] == "failed"

    def test_filter_audience_single(self, auth_headers):
        r = requests.get(f"{API}/admin/email-logs?audience=single", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        for row in r.json()["logs"]:
            assert row["audience"] == "single"

    def test_filter_q_search(self, auth_headers):
        # trigger a waitlist signup to ensure at least one log exists with a known subject
        uid = uuid.uuid4().hex[:6]
        requests.post(f"{API}/waitlist", json={
            "full_name": f"TEST6_LOG {uid}",
            "email": f"test6_log_{uid}@example.com",
            "fitness_goal": "x",
            "device_type": "iPhone",
        }, timeout=20)
        r = requests.get(f"{API}/admin/email-logs?q=Revenge", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        # should return at least one entry where 'Revenge' is in subject or to
        # soft assert: don't fail if Resend skipped due to quota — logs may still be empty
        for row in r.json()["logs"]:
            t = (row.get("to") or "") + " " + (row.get("subject") or "")
            assert "revenge" in t.lower() or "welcome" in t.lower()

    def test_delete_wrong_confirmation_returns_422(self, auth_headers):
        r = requests.delete(f"{API}/admin/email-logs", headers=auth_headers,
                            json={"confirmation": "delete"}, timeout=15)
        assert r.status_code == 422

    @pytest.mark.destructive
    def test_delete_correct_confirmation_clears(self, auth_headers):
        r = requests.delete(f"{API}/admin/email-logs", headers=auth_headers,
                            json={"confirmation": "DELETE"}, timeout=15)
        assert r.status_code == 200
        assert "deleted" in r.json()


# ---------- Regression: iter5 endpoints still work ----------

class TestIter5Regression:
    def test_recipient_counts(self, auth_headers):
        r = requests.get(f"{API}/admin/recipient-counts", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        for k in ("waitlist", "creator_applicants", "approved_creators",
                  "iphone_users", "android_users", "everyone"):
            assert k in r.json()

    def test_user_search_min_chars(self, auth_headers):
        r = requests.get(f"{API}/admin/users/search?q=a", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json() == {"results": []}

    def test_signatures_list(self, auth_headers):
        r = requests.get(f"{API}/admin/signatures", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        names = [s["name"] for s in r.json()]
        assert "Revenge Arc Original" in names

    def test_stats_returns_growth(self, auth_headers):
        r = requests.get(f"{API}/admin/stats?range=14d", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert "growth" in r.json()
        assert r.json()["range"] == "14d"
