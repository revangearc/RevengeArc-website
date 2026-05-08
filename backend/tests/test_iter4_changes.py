"""Iteration 4 targeted backend tests:
- Admin password changed to 'Bashar1212'; old password 'RevengeArc2026!' must reject
- /api/config/public returns Revengearchelp@gmail.com (lowercase 'arc')
- Email shell (_wrap_email) contains comprehensive dark-mode markers and new support email
- Waitlist signup still works end-to-end with new password / new support email
"""
import os
import sys
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://arc-preview-2.preview.emergentagent.com").rstrip("/")
NEW_PASSWORD = "Bashar1212"
OLD_PASSWORD = "RevengeArc2026!"
SUPPORT_EMAIL = "Revengearchelp@gmail.com"


def _email(prefix="user"):
    return f"TEST4_{prefix}_{uuid.uuid4().hex[:10]}@example.com"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_headers(session):
    r = session.post(f"{BASE_URL}/api/admin/login", json={"password": NEW_PASSWORD})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['token']}", "Content-Type": "application/json"}


# ===================== Admin password rotation =====================
class TestAdminPassword:
    def test_new_password_works(self, session):
        r = session.post(f"{BASE_URL}/api/admin/login", json={"password": NEW_PASSWORD})
        assert r.status_code == 200
        assert "token" in r.json()
        assert isinstance(r.json()["token"], str)

    def test_old_password_rejected(self, session):
        r = session.post(f"{BASE_URL}/api/admin/login", json={"password": OLD_PASSWORD})
        assert r.status_code == 401

    def test_empty_password_rejected(self, session):
        r = session.post(f"{BASE_URL}/api/admin/login", json={"password": ""})
        assert r.status_code in (400, 401, 422)


# ===================== Public config support email =====================
class TestPublicConfig:
    def test_support_email_correct_spelling(self, session):
        r = session.get(f"{BASE_URL}/api/config/public")
        assert r.status_code == 200, r.text
        d = r.json()
        assert "support_email" in d
        # exact spelling check: lowercase 'arc' (not 'ark'), capital R only on first letter
        assert d["support_email"] == SUPPORT_EMAIL, f"got {d['support_email']!r}"
        assert "Ark" not in d["support_email"]
        assert "ark" in d["support_email"].lower() or "arc" in d["support_email"].lower()
        assert "arc" in d["support_email"]  # 'arc' lowercase substring


# ===================== Email shell dark-mode markers =====================
class TestEmailShellDarkMode:
    @pytest.fixture(scope="class")
    def html(self):
        sys.path.insert(0, "/app/backend")
        from server import _wrap_email  # type: ignore
        return _wrap_email("Test Title", "<p>body content</p>")

    def test_meta_color_scheme_dark_only(self, html):
        assert '<meta name="color-scheme" content="dark only">' in html

    def test_supported_color_schemes(self, html):
        assert '<meta name="supported-color-schemes" content="dark only">' in html

    def test_prefers_color_scheme_dark_media(self, html):
        assert "@media (prefers-color-scheme: dark)" in html

    def test_data_ogsc_selector(self, html):
        assert "[data-ogsc]" in html

    def test_data_ogsb_selector(self, html):
        assert "[data-ogsb]" in html

    def test_mobile_media_query(self, html):
        assert "@media only screen and (max-width: 600px)" in html

    def test_bgcolor_dark_attribute(self, html):
        assert 'bgcolor="#0a0814"' in html
        assert 'bgcolor="#05050a"' in html

    def test_support_email_correct_spelling(self, html):
        assert SUPPORT_EMAIL in html
        assert "RevengeArkHelp" not in html
        assert "RevengeArkHelp@gmail.com" not in html

    def test_apple_disable_message_reformatting(self, html):
        assert 'name="x-apple-disable-message-reformatting"' in html


# ===================== Regression: previously-passing flows =====================
class TestRegressionFlows:
    def test_waitlist_signup_still_works(self, session, admin_headers):
        email = _email("wl")
        r = session.post(f"{BASE_URL}/api/waitlist", json={
            "full_name": "TEST4 Warrior",
            "email": email,
            "fitness_goal": "Cut 20 lbs",
            "device_type": "iPhone",
            "instagram": "@warrior",
        })
        assert r.status_code == 200, r.text
        assert r.json()["email"] == email.lower()
        # verify persistence
        wl = session.get(f"{BASE_URL}/api/admin/waitlist", headers=admin_headers).json()
        assert email.lower() in [w["email"] for w in wl]

    def test_creator_application_still_works(self, session):
        r = session.post(f"{BASE_URL}/api/creator-applications", json={
            "full_name": "TEST4 Creator",
            "email": _email("cr"),
            "phone": "+15551234567",
            "instagram": "@iter4creator",
            "tiktok": "",
            "why_support": "love brand",
            "desired_pay": "$500/post",
            "audience": "100k IG",
        })
        assert r.status_code == 200, r.text
        assert r.json()["status"] == "pending"

    def test_admin_stats_still_works(self, session, admin_headers):
        r = session.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ["total_waitlist", "total_creators", "growth", "device_split"]:
            assert k in d

    def test_admin_recipient_counts_still_works(self, session, admin_headers):
        r = session.get(f"{BASE_URL}/api/admin/recipient-counts", headers=admin_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ["waitlist", "creator_applicants", "approved_creators",
                  "iphone_users", "android_users", "everyone"]:
            assert k in d

    def test_admin_templates_crud(self, session, admin_headers):
        # list
        r = session.get(f"{BASE_URL}/api/admin/templates", headers=admin_headers)
        assert r.status_code == 200
        # create
        body = {"name": f"TEST4 tmpl {uuid.uuid4().hex[:6]}", "subject": "S", "html_content": "<p>x</p>"}
        c = session.post(f"{BASE_URL}/api/admin/templates", headers=admin_headers, json=body)
        assert c.status_code == 200, c.text
        tid = c.json()["id"]
        # delete
        d = session.delete(f"{BASE_URL}/api/admin/templates/{tid}", headers=admin_headers)
        assert d.status_code == 200

    def test_admin_announce_everyone(self, session, admin_headers):
        r = session.post(f"{BASE_URL}/api/admin/announce", headers=admin_headers, json={
            "subject": "TEST4 broadcast",
            "html_content": "<p>hi</p>",
            "recipient_group": "everyone",
        })
        assert r.status_code == 200
        d = r.json()
        for k in ["sent", "failed", "total"]:
            assert k in d
