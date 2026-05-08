# Revenge Arc — PRD

## Original Problem Statement
Cinematic AI self-improvement website + admin + backend + Resend email system. Iteration 3 expanded scope significantly: pricing section, dedicated AI Food Scan, legal pages, admin time-range stats, creator status filters + view modal, broadcast recipient types (incl. iPhone/Android/Custom), email templates CRUD, sender domain swap (no-reply@revengearc.com), removal of compensation_type field.

## User Personas
- Warrior (visitor) — wants early access, joins waitlist, may apply as creator
- Creator — applies via creator program, gets approved/rejected
- Admin (operator) — manages waitlist, creators, broadcasts, templates

## Architecture
- **Frontend**: React 19 + Tailwind + Shadcn/UI + motion + lucide-react. Routes: `/`, `/admin`, `/admin/dashboard`, `/terms`, `/privacy`, `/refund`, `/contact`, `/support`.
- **Backend**: FastAPI + Motor (MongoDB) + Resend SDK. All routes `/api/*`.
- **Email**: Resend with verified custom sender `no-reply@revengearc.com` (domain `revengearc.com`). Support email `RevengeArkHelp@gmail.com` injected into shell + footer.
- **Auth**: Admin password (env `ADMIN_PASSWORD`) → static bearer token (env `ADMIN_TOKEN`).

## Implemented (Feb 2026)

### Iteration 1 (MVP)
- Cinematic landing with 13 sections + waitlist + creator program + admin

### Iteration 2 (polish)
- Removed Emergent badge, fake numbers, fixed input readability, TikTok icon, broadcast upgrade

### Iteration 3 (this iteration)
- ✅ Sender swapped from `onboarding@resend.dev` → `no-reply@revengearc.com` (verified domain)
- ✅ Email shell adds Instagram/TikTok/Discord pills + `RevengeArkHelp@gmail.com` support line
- ✅ Navbar: Features dropdown (9 features, smooth-scroll) + Pricing + Creators + FAQ
- ✅ Hero dead-space removed, stat cards responsive, ribbon transitions directly into dashboard
- ✅ AI Food Scan dedicated section with Honey Wings mockup + 5 feature cards
- ✅ Pricing section (Free $0 + Premium $15.99/mo or $115.99/yr from $191.88, save 40%)
- ✅ Creator form: removed `compensation_type`, kept `desired_pay` with new placeholder
- ✅ FAQ rewritten with 9 product-specific questions
- ✅ Legal pages: Terms, Privacy, Refund, Contact, Support — all themed
- ✅ Footer: support email + internal links to all legal pages
- ✅ Admin Overview: 8-range time selector (24h/2d/7d/14d/30d/3mo/6mo/1y) + animated SVG growth chart with waitlist + creators series
- ✅ Admin Creators: 4 status filters (All/Pending/Approved/Rejected) + full View modal with every answer + dedicated "Send Email" button
- ✅ Admin Broadcast: 7 recipient groups (waitlist / creator_applicants / approved_creators / iphone_users / android_users / everyone / custom)
- ✅ Custom recipients: chip input (Enter/comma/space to add, backspace to remove)
- ✅ Email templates CRUD: save/load/update/delete persistent templates
- ✅ "Send Email" from creator card → `/admin/dashboard?tab=broadcast&recipients=<email>` prefill
- ✅ Premium toasts (sonner richColors + custom Revenge Arc styling)
- ✅ Backend tests: 52/52 passing

## Backlog (P1)
- Server.py is approaching 600 lines; split into routes/admin.py, routes/public.py, email/renderer.py modules
- Migrate FastAPI deprecated `@app.on_event("shutdown")` to lifespan handler
- Live Gym Buddie AI chat (Universal LLM key — Claude Sonnet 4.5)

## Backlog (P2)
- Creator duplicate-application guard
- ADMIN_TOKEN → JWT with expiry & refresh
- Broadcast: concurrent send via `asyncio.gather` + semaphore for 50k+ lists
- Admin: bulk approve/reject creators
- Email open/click tracking via Resend webhooks

## Credentials
- Admin password: `RevengeArc2026!` (also `/app/memory/test_credentials.md`)
- Sender: `no-reply@revengearc.com` (Resend verified domain `revengearc.com`)
- Support: `RevengeArkHelp@gmail.com`
