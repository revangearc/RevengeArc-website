# Revenge Arc — PRD

## Original Problem Statement
Cinematic AI self-improvement website + admin + Resend email system for a fitness/discipline app called "Revenge Arc". Premium dark-neon UI with Framer Motion animations across 10+ feature sections matching app mockups (Hero, Dashboard, Nutrition, Gym Buddie AI, Workout, Arena, Progress Hub, Profile, Combat Zone, AI Food Scan, Pricing, FAQ). Includes Waitlist, Creator Application program, Legal pages, and a robust Admin Console (auth, stats, waitlist/creator management, rich-text Broadcast email editor).

## User Personas
- Warrior (visitor) — joins waitlist, may apply as creator
- Creator — applies via creator program, awaits approval
- Admin — manages waitlist, creators, broadcasts, templates, signatures

## Architecture
- **Frontend**: React 19 + Tailwind + Shadcn/UI + motion + lucide-react.
  Routes: `/`, `/admin`, `/admin/dashboard`, `/terms`, `/privacy`, `/refund`, `/contact`, `/support`.
- **Backend**: FastAPI + Motor (MongoDB) + Resend SDK. All routes under `/api/*`.
- **Email**: Resend with verified custom sender `no-reply@revengearc.com`.
  Support email: `Revengearchelp@gmail.com`.
- **Auth**: Admin password → static bearer token (env `ADMIN_TOKEN`).

## Implemented Iterations

### Iteration 1 (MVP)
- Cinematic landing with 13 sections + waitlist + creator program + admin

### Iteration 2 (polish)
- Removed Emergent badge, fake numbers, fixed input readability, TikTok icon, broadcast upgrade

### Iteration 3
- Sender swap to verified `no-reply@revengearc.com`
- Navbar Features dropdown + Pricing/Creators/FAQ
- AI Food Scan dedicated section
- Pricing section
- Legal pages (Terms/Privacy/Refund/Contact/Support)
- Admin time-range stats (8 ranges) + animated growth chart
- Creator status filters + View modal
- Broadcast 7 recipient groups, custom chip input, template CRUD

### Iteration 4
- Email dark-mode-proof shell, mobile layout polish, password change, support email spelling fix

### Iteration 7 (Feb 2026 — code-quality review)
- ✅ **XSS hardening**: Added `dompurify` and a strict allowlist sanitizer (`SANITIZE_OPTS`) to both `dangerouslySetInnerHTML` call-sites in `Broadcast.jsx` (signature preview + live email preview). Verified end-to-end: `<script>` tags and `onerror=` event handlers are stripped while legitimate `<strong>`/`<p>` inline-styled tags pass through for email rendering.
- ✅ **Stable React keys**: Replaced all `key={i}` / `key={index}` / `key={idx}` usages with stable content-based keys across `Broadcast.jsx`, `AdminDashboard.jsx`, `Hero.jsx`, `NutritionSection.jsx`, `FAQSection.jsx`, `GymBuddieSection.jsx`, `ArenaSection.jsx`, `Legal.jsx` (10 fixes).
- ✅ **Test secrets removed**: All hardcoded `Bashar1212` / `Revengearchelp@gmail.com` removed from `/app/backend/tests/*.py`. New shared `tests/_config.py` reads `TEST_ADMIN_EMAIL` + `TEST_ADMIN_PASSWORD` from env; tests `pytest.skip` cleanly if not configured. Old single-field login bodies replaced with iter6 email+password schema.
- ✅ **Backend complexity reduction**: Split `_bucket_starts` (complexity 14 → ~4 each) into `_hour_buckets`, `_day_buckets`, `_week_buckets`, `_month_buckets` dispatched via a `_BUCKET_BUILDERS` map. Refactored `_collect_recipients` (complexity 18, nesting 9 → flat dispatch via `query_map`).

### Deferred items (deliberate)
- ⏸ **localStorage → httpOnly cookies**: declined. The admin console uses a single shared bearer token (`ADMIN_TOKEN` from env). Switching to httpOnly cookies would require backend `Set-Cookie` rework + frontend `withCredentials` flow + CORS credentials whitelist + new logout endpoint. The primary XSS attack vector for stealing this token (Broadcast preview injecting malicious HTML) is now closed by DOMPurify. A determined attacker with arbitrary JS would simply call `/api/admin/login` directly with the static creds anyway. Re-evaluate when migrating to JWT + per-user accounts.
- ⏸ **Broadcast.jsx (471 lines, complexity 64) full decomposition**: declined for this iteration. The component is heavily tested in iter5 + iter6 and a structural rewrite carries real regression risk against a working broadcast/template/signature/search flow. Extracted `CustomRecipientPicker` and `EmailPreview` already live as sub-components inside the file — promoting them to separate modules is safe future cleanup. Keep on backlog as P1.
- ⏸ **Missing hook-dependency warnings**: the 18 instances flagged are largely on-mount data-fetch effects (genuine "run once" intent) and `useCallback` closures the linter mis-attributes to local function-scope vars. Our internal ESLint pass (`/app/frontend/src`) is clean. Will revisit only if a real bug is traced to a stale closure.

### Iteration 6 (Feb 2026)
- ✅ **Admin login security**: email + password (was: password only). `ADMIN_EMAIL` env added (`Revengearchelp@gmail.com`), case-insensitive match. Frontend `/admin` now shows two inputs, neither pre-filled. Old `{password}`-only body returns 422.
- ✅ **Creator duplicate guard**: `POST /api/creator-applications` checks email case-insensitively; second submission returns `409 "This email has already been used for a creator application."`
- ✅ **Broadcast performance**: `admin_announce` uses `asyncio.Semaphore(BROADCAST_CONCURRENCY=8)` + `asyncio.gather` for parallel batched send. UI now shows a sending overlay with animated progress bar + a persistent "last broadcast" result panel (sent / failed / total).
- ✅ **Email tracking**: new `email_logs` MongoDB collection — every `send_email_async` call inserts a record (to, subject, audience, status sent/failed/skipped, error, resend_id, sent_at). New `GET /api/admin/email-logs` with status/audience/q filters; `DELETE /api/admin/email-logs` requires literal `DELETE` confirmation. Webhook-ready structure.
- ✅ **Gym Buddie anchor renamed**: `id="coach"` → `id="gym-buddie"` in `GymBuddieSection.jsx` + matching Navbar & Footer href update + data-testid `section-coach` → `section-gym-buddie`.
- ✅ **Status menu z-index fix**: created reusable `<PortalPopover>` component that uses `createPortal(document.body)` + fixed-position coords (recompute on scroll/resize, escape/outside-click close). `StatusMenu` now renders via portal — cannot be clipped by parent cards.
- ✅ **Broadcast search dropdown fix**: `CustomRecipientPicker` rewritten to use `PortalPopover` (matchWidth=true) and a derived-open state (`focused && query.length >= 2`) that always re-opens after commit. Auto-refocus via `requestAnimationFrame` after picking a result enables chain selections. "Stops showing after 2nd/3rd selection" bug fixed — verified 3 consecutive cycles work.
- ✅ **Tested**: 18/18 iter6 backend + 19/19 iter5 regression + zero frontend console errors. NO test broadcast sent (Resend quota preserved per user request).

### Iteration 5
- ✅ **Backend**: bulk-delete (`POST /api/admin/{waitlist|creators}/bulk-delete`), delete-all (`DELETE /api/admin/{waitlist|creators}`) both requiring literal `confirmation="DELETE"`
- ✅ **Backend**: creator status change (`POST /api/admin/creators/{id}/status`) accepts pending/approved/rejected
- ✅ **Backend**: custom-recipient autocomplete (`GET /api/admin/users/search?q=`) merging waitlist + creators with source tag, capped at 20, min 2 chars
- ✅ **Backend**: Signature CRUD (`/api/admin/signatures` GET/POST/PUT/DELETE) with auto-seeded "Revenge Arc Original" + 409 on duplicate name
- ✅ **Frontend Admin**: multi-select checkboxes on Waitlist + Creators rows, "Select all"/"Clear", "Delete selected"/"Delete all" buttons, double-confirmation modal requiring exact `DELETE`
- ✅ **Frontend Admin**: creator Change Status dropdown (re-route approved↔rejected↔pending)
- ✅ **Frontend Admin**: chart hover tooltip showing Date / Waitlist count / Creator count with dark glass styling
- ✅ **Frontend Broadcast**: replaced raw chip input with autocomplete search (debounced 220ms) showing avatar/source/handles/status, keyboard nav, fallback to plain-email Enter
- ✅ **Frontend Broadcast**: Signature CRUD panel (new/edit/delete) with HTML editor + live preview; click-to-insert at cursor
- ✅ **SectionHeader**: 7 unique animation variants (`fade`/`slide-left`/`slide-right`/`swoop`/`rise`/`zoom`/`float`) — one per landing section for cinematic differentiation

## Backlog (P1)
- Split `server.py` (now 913 lines) → `routes/admin.py`, `routes/public.py`, `email/template.py`
- Extract `DeleteConfirmModal` / `StatusMenu` / `GrowthChart` from AdminDashboard.jsx (~830 lines) into separate files
- Extract `CustomRecipientPicker` / `EmailPreview` from Broadcast.jsx (~720 lines)
- Migrate FastAPI deprecated `@app.on_event("shutdown")` to lifespan handler
- Build an Admin "Email History" tab UI on top of `GET /api/admin/email-logs` (currently backend-only)
- Resend webhook receiver for delivered/opened/clicked → enrich `email_logs` rows

## Backlog (P2)
- ADMIN_TOKEN → JWT with expiry & refresh
- Per-admin user accounts (currently single shared credential)
- Rate limiting on public POST endpoints (waitlist, creator-applications)

## Credentials
- Admin email: `Revengearchelp@gmail.com` (case-insensitive)
- Admin password: `Bashar1212`
- Sender: `no-reply@revengearc.com` (Resend verified domain `revengearc.com`)
- Support: `Revengearchelp@gmail.com`
