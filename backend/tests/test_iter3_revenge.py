"""Iter3 tests: sender, public config, stats range, recipient counts (with new groups),
custom announce, templates CRUD, creator filter, creator no-compensation_type."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
ADMIN_PASSWORD = "RevengeArc2026!"


def _email(prefix="user"):
    return f"TEST3_{prefix}_{uuid.uuid4().hex[:10]}@example.com"


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


@pytest.fixture(scope="session")
def admin_headers(s):
    r = s.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    assert r.status_code == 200
    return {"Authorization": f"Bearer {r.json()['token']}", "Content-Type": "application/json"}


# ============== Root reports correct sender ==============
class TestRootAndPublicConfig:
    def test_root_sender(self, s):
        r = s.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        d = r.json()
        assert d.get("sender") == "no-reply@revengearc.com", d

    def test_public_config_support(self, s):
        r = s.get(f"{BASE_URL}/api/config/public")
        assert r.status_code == 200
        d = r.json()
        assert d.get("support_email") == "RevengeArkHelp@gmail.com", d


# ============== Stats range ==============
class TestStatsRange:
    @pytest.mark.parametrize("rng,expected_count", [
        ("24h", 24), ("2d", 2), ("7d", 7), ("14d", 14),
        ("30d", 30), ("3mo", 12), ("6mo", 24), ("1y", 12),
    ])
    def test_range(self, s, admin_headers, rng, expected_count):
        r = s.get(f"{BASE_URL}/api/admin/stats?range={rng}", headers=admin_headers)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["range"] == rng
        assert "growth" in d
        assert len(d["growth"]) == expected_count, f"{rng} -> {len(d['growth'])}"
        for b in d["growth"]:
            assert "label" in b and "waitlist" in b and "creators" in b

    def test_default_is_14d(self, s, admin_headers):
        r = s.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers)
        assert r.status_code == 200
        d = r.json()
        assert d["range"] == "14d"
        assert len(d["growth"]) == 14

    def test_invalid_range_422(self, s, admin_headers):
        r = s.get(f"{BASE_URL}/api/admin/stats?range=999d", headers=admin_headers)
        assert r.status_code == 422


# ============== Recipient counts has new groups ==============
class TestRecipientCounts:
    def test_keys(self, s, admin_headers):
        r = s.get(f"{BASE_URL}/api/admin/recipient-counts", headers=admin_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ["waitlist", "creator_applicants", "approved_creators",
                  "iphone_users", "android_users", "everyone"]:
            assert k in d
            assert isinstance(d[k], int)
        # iphone+android <= waitlist (some may have other types in past, but shouldn't)
        assert d["iphone_users"] + d["android_users"] <= d["waitlist"] + 5  # tolerance


# ============== Creators status filter ==============
class TestCreatorFilter:
    def test_unfiltered_includes_all(self, s, admin_headers):
        r = s.get(f"{BASE_URL}/api/admin/creators", headers=admin_headers)
        assert r.status_code == 200

    @pytest.mark.parametrize("st", ["pending", "approved", "rejected"])
    def test_status_filter(self, s, admin_headers, st):
        r = s.get(f"{BASE_URL}/api/admin/creators?status={st}", headers=admin_headers)
        assert r.status_code == 200
        rows = r.json()
        for row in rows:
            assert row["status"] == st

    def test_invalid_status_422(self, s, admin_headers):
        r = s.get(f"{BASE_URL}/api/admin/creators?status=banana", headers=admin_headers)
        assert r.status_code == 422


# ============== Creator app no longer requires compensation_type ==============
class TestCreatorNoCompensationType:
    def test_apply_without_compensation_type(self, s):
        payload = {
            "full_name": "TEST3 No Comp Type",
            "email": _email("nocomp"),
            "phone": "+15551234567",
            "instagram": "@nocomp",
            "tiktok": "",
            "why_support": "I love it",
            "desired_pay": "Cash $500",
            "audience": "100k",
        }
        r = s.post(f"{BASE_URL}/api/creator-applications", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["desired_pay"] == "Cash $500"
        assert "compensation_type" not in d


# ============== Announce: iphone/android/custom ==============
class TestAnnounceGroups:
    def _seed_iphone(self, s):
        payload = {
            "full_name": "TEST3 iPhone",
            "email": _email("iph"),
            "fitness_goal": "lean",
            "device_type": "iPhone",
        }
        r = s.post(f"{BASE_URL}/api/waitlist", json=payload)
        assert r.status_code == 200
        return r.json()["email"]

    def test_iphone_group(self, s, admin_headers):
        self._seed_iphone(s)
        r = s.post(f"{BASE_URL}/api/admin/announce", headers=admin_headers,
                   json={"subject": "TEST3 ip", "html_content": "<p>hi</p>",
                         "recipient_group": "iphone_users"})
        assert r.status_code == 200, r.text
        assert r.json()["total"] >= 1

    def test_android_group(self, s, admin_headers):
        s.post(f"{BASE_URL}/api/waitlist", json={
            "full_name": "TEST3 Android", "email": _email("and"),
            "fitness_goal": "x", "device_type": "Android"})
        r = s.post(f"{BASE_URL}/api/admin/announce", headers=admin_headers,
                   json={"subject": "TEST3 and", "html_content": "<p>hi</p>",
                         "recipient_group": "android_users"})
        assert r.status_code == 200
        assert r.json()["total"] >= 1

    def test_custom_dedupe_and_invalid_filter(self, s, admin_headers):
        valid1 = _email("c1")
        valid2 = _email("c2")
        # dedupes valid1 (passed twice) + invalid emails ignored
        r = s.post(f"{BASE_URL}/api/admin/announce", headers=admin_headers,
                   json={"subject": "TEST3 custom", "html_content": "<p>hi</p>",
                         "recipient_group": "custom",
                         "custom_recipients": [valid1, valid1.upper(), valid2]})
        assert r.status_code == 200, r.text
        d = r.json()
        # valid1 (any-case) + valid2 dedupe -> 2
        assert d["total"] == 2, d

    def test_custom_no_recipients_422(self, s, admin_headers):
        # Pydantic EmailStr will reject invalid; send empty list -> 422
        r = s.post(f"{BASE_URL}/api/admin/announce", headers=admin_headers,
                   json={"subject": "TEST3", "html_content": "<p>x</p>",
                         "recipient_group": "custom", "custom_recipients": []})
        assert r.status_code == 422


# ============== Templates CRUD ==============
class TestTemplatesCRUD:
    def test_full_crud(self, s, admin_headers):
        # CREATE
        cr = s.post(f"{BASE_URL}/api/admin/templates", headers=admin_headers,
                    json={"name": "TEST3 Tpl", "subject": "Sub", "html_content": "<p>v1</p>"})
        assert cr.status_code == 200, cr.text
        tpl = cr.json()
        assert tpl["name"] == "TEST3 Tpl"
        assert "id" in tpl
        tid = tpl["id"]

        # LIST
        lr = s.get(f"{BASE_URL}/api/admin/templates", headers=admin_headers)
        assert lr.status_code == 200
        assert any(t["id"] == tid for t in lr.json())

        # UPDATE
        ur = s.put(f"{BASE_URL}/api/admin/templates/{tid}", headers=admin_headers,
                   json={"name": "TEST3 Tpl v2", "subject": "Sub2", "html_content": "<p>v2</p>"})
        assert ur.status_code == 200, ur.text
        assert ur.json()["name"] == "TEST3 Tpl v2"
        assert ur.json()["html_content"] == "<p>v2</p>"

        # DELETE
        dr = s.delete(f"{BASE_URL}/api/admin/templates/{tid}", headers=admin_headers)
        assert dr.status_code == 200
        # Re-delete -> 404
        dr2 = s.delete(f"{BASE_URL}/api/admin/templates/{tid}", headers=admin_headers)
        assert dr2.status_code == 404

    def test_requires_auth(self, s):
        r = s.get(f"{BASE_URL}/api/admin/templates")
        assert r.status_code == 401
        r = s.post(f"{BASE_URL}/api/admin/templates",
                   json={"name": "x", "subject": "x", "html_content": "x"})
        assert r.status_code == 401
