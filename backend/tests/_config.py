"""Shared test configuration — reads admin creds from environment variables only.

Tests must NEVER hardcode credentials. Set these in your local shell or CI:

    export TEST_ADMIN_EMAIL=Revengearchelp@gmail.com
    export TEST_ADMIN_PASSWORD=<your-admin-password>
    export TEST_API_BASE=http://localhost:8001     # optional, defaults to local

If a variable is missing at runtime, pytest will skip the test rather than
emit a confusing 401 or false-positive failure.
"""
from __future__ import annotations
import os
import pytest

ADMIN_EMAIL = os.environ.get("TEST_ADMIN_EMAIL", "")
ADMIN_PASSWORD = os.environ.get("TEST_ADMIN_PASSWORD", "")
API_BASE = os.environ.get("TEST_API_BASE", "http://localhost:8001").rstrip("/")


def require_admin_creds():
    """Skip the calling test if admin creds are not configured via env."""
    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        pytest.skip(
            "TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD not set in env — "
            "see backend/tests/_config.py for setup instructions."
        )
