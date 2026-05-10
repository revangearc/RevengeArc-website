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

### Iteration 5 (Feb 2026 — this session)
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
- ✅ **Tested**: 89/90 backend regression pass + 100% iter5 frontend Playwright pass; only flake is environmental Resend quota

## Backlog (P1)
- Split `server.py` (currently 819 lines) → `routes/admin.py`, `routes/public.py`, `email/template.py`
- Extract `DeleteConfirmModal` / `StatusMenu` / `GrowthChart` from AdminDashboard.jsx (~800 lines) into separate files
- Extract `CustomRecipientPicker` / `EmailPreview` from Broadcast.jsx (~624 lines)
- Migrate FastAPI deprecated `@app.on_event("shutdown")` to lifespan handler
- Live Gym Buddie AI chat (Universal LLM key — Claude Sonnet 4.5)

## Backlog (P2)
- Creator duplicate-application guard
- ADMIN_TOKEN → JWT with expiry & refresh
- Broadcast: concurrent send via `asyncio.gather` + semaphore for 50k+ lists
- Email open/click tracking via Resend webhooks
- Rename Gym Buddie section anchor `id='coach'` → `id='gym-buddie'` for consistency

## Credentials
- Admin password: `Bashar1212` (also `/app/memory/test_credentials.md`)
- Sender: `no-reply@revengearc.com` (Resend verified domain `revengearc.com`)
- Support: `Revengearchelp@gmail.com`
