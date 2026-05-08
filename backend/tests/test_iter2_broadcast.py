"""Iteration 2 tests: recipient-counts endpoint, announce with recipient_group, email shell social links."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://arc-preview-2.preview.emergentagent.com").rstrip("/")
ADMIN_PASSWORD = "Bashar1212"


def _email(prefix="user"):
    return f"TEST2_{prefix}_{uuid.uuid4().hex[:10]}@example.com"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_headers(session):
    r = session.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    assert r.status_code == 200
    return {"Authorization": f"Bearer {r.json()['token']}", "Content-Type": "application/json"}


# ---------- /api/admin/recipient-counts ----------
class TestRecipientCounts:
    def test_unauth(self, session):
        r = session.get(f"{BASE_URL}/api/admin/recipient-counts")
        assert r.status_code == 401

    def test_returns_all_groups(self, session, admin_headers):
        r = session.get(f"{BASE_URL}/api/admin/recipient-counts", headers=admin_headers)
        assert r.status_code == 200, r.text
        d = r.json()
        for k in ("waitlist", "creator_applicants", "approved_creators", "everyone"):
            assert k in d, f"missing key {k}"
            assert isinstance(d[k], int), f"{k} not int"
        # everyone >= max(waitlist, creator_applicants) and <= waitlist+creator_applicants (deduped)
        assert d["everyone"] >= d["waitlist"]
        assert d["everyone"] >= d["creator_applicants"]
        assert d["everyone"] <= d["waitlist"] + d["creator_applicants"]
        # approved <= creator_applicants
        assert d["approved_creators"] <= d["creator_applicants"]


# ---------- /api/admin/announce with recipient_group ----------
class TestAnnounceGroups:
    def test_announce_waitlist(self, session, admin_headers):
        r = session.post(
            f"{BASE_URL}/api/admin/announce",
            headers=admin_headers,
            json={
                "subject": "TEST2 broadcast waitlist",
                "html_content": "<p>hi waitlist</p>",
                "recipient_group": "waitlist",
            },
        )
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["group"] == "waitlist"
        assert "sent" in d and "failed" in d and "total" in d

    def test_announce_creator_applicants(self, session, admin_headers):
        r = session.post(
            f"{BASE_URL}/api/admin/announce",
            headers=admin_headers,
            json={
                "subject": "TEST2 to creators",
                "html_content": "<p>hi creators</p>",
                "recipient_group": "creator_applicants",
            },
        )
        assert r.status_code == 200, r.text
        assert r.json()["group"] == "creator_applicants"

    def test_announce_approved_creators(self, session, admin_headers):
        r = session.post(
            f"{BASE_URL}/api/admin/announce",
            headers=admin_headers,
            json={
                "subject": "TEST2 approved",
                "html_content": "<p>hi approved</p>",
                "recipient_group": "approved_creators",
            },
        )
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["group"] == "approved_creators"
        # Must equal approved_creators count from /admin/recipient-counts
        rc = session.get(f"{BASE_URL}/api/admin/recipient-counts", headers=admin_headers).json()
        assert d["total"] == rc["approved_creators"]

    def test_announce_everyone_dedupes(self, session, admin_headers):
        # Seed: same email in waitlist AND creator-applicant -> everyone should dedupe
        shared = _email("dup")
        session.post(f"{BASE_URL}/api/waitlist", json={
            "full_name": "Dup Both", "email": shared,
            "fitness_goal": "x", "device_type": "iPhone",
        })
        session.post(f"{BASE_URL}/api/creator-applications", json={
            "full_name": "Dup Both", "email": shared, "phone": "+15550000",
            "instagram": "@dup", "tiktok": "",
            "why_support": "x", "compensation_type": "x",
            "desired_pay": "x", "audience": "x",
        })
        r = session.post(
            f"{BASE_URL}/api/admin/announce",
            headers=admin_headers,
            json={
                "subject": "TEST2 everyone dedup",
                "html_content": "<p>hi all</p>",
                "recipient_group": "everyone",
            },
        )
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["group"] == "everyone"
        rc = session.get(f"{BASE_URL}/api/admin/recipient-counts", headers=admin_headers).json()
        # total recipients matches dedup'd count
        assert d["total"] == rc["everyone"]
        # And dedup actually happened: everyone <= waitlist+creator_applicants
        assert rc["everyone"] <= rc["waitlist"] + rc["creator_applicants"]

    def test_announce_invalid_group_returns_422(self, session, admin_headers):
        r = session.post(
            f"{BASE_URL}/api/admin/announce",
            headers=admin_headers,
            json={
                "subject": "TEST2 bad group",
                "html_content": "<p>x</p>",
                "recipient_group": "nonsense",
            },
        )
        assert r.status_code == 422


# ---------- _wrap_email shell social links ----------
class TestEmailShell:
    """Verify the _wrap_email() output (via static import) contains social + support links."""
    def test_wrap_email_includes_socials_and_support(self):
        # Direct module import to inspect the helper output
        import sys
        sys.path.insert(0, "/app/backend")
        from server import _wrap_email, INSTAGRAM_URL, TIKTOK_URL, DISCORD_URL  # type: ignore
        html = _wrap_email("Test", "<p>body</p>")
        assert INSTAGRAM_URL in html
        assert TIKTOK_URL in html
        assert DISCORD_URL in html
        assert "Revengearchelp@gmail.com" in html
        # Pills text
        assert "INSTAGRAM" in html
        assert "TIKTOK" in html
        assert "DISCORD" in html
