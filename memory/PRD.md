# Revenge Arc — Product Requirement Document

## Original Problem Statement
Build a FULL premium production-level cinematic website for the **Revenge Arc** app — a futuristic dark neon AI self-improvement / fitness movement. Includes hero, all 13 product sections matching real app mockups, waitlist + creator program forms with Resend confirmations, and a full admin dashboard for managing both.

## User Personas
- **Warrior (end user)** — wants early access, cinematic motivation, and a glimpse of the app product before launch.
- **Creator** — content creator/influencer applying to be paid partner of the brand.
- **Admin (operator)** — Revenge Arc team member who needs to monitor waitlist growth, approve/reject creators, and broadcast launch announcements.

## Architecture
- **Frontend**: React 19 + Tailwind + Shadcn/UI + `motion` (Framer Motion v11) + lucide-react. Single landing page (`/`) + `/admin` (login) + `/admin/dashboard`.
- **Backend**: FastAPI + Motor (async MongoDB) + Resend SDK (async via `asyncio.to_thread`). All routes under `/api`.
- **Database**: MongoDB collections — `waitlist`, `creators`. UUIDs as `id`, `_id` excluded from all responses.
- **Email**: Resend with configurable `SENDER_EMAIL`/`SENDER_NAME`. HTML template wrapper styled to match brand.
- **Auth**: Admin route is password-gated; `/api/admin/login` returns a static bearer token (env `ADMIN_TOKEN`) checked on all `/api/admin/*` endpoints.

## Tech Decisions
- **Fonts**: Unbounded (display) + Inter (body) — chosen for cinematic, distinctive feel.
- **Theme tokens**: Deep black bg + neon purple/cyan/amber/green/red glows with glassmorphism + grain overlay + canvas particle field.
- **No Universal LLM key needed** — Gym Buddie AI is a static showcase per user choice.

## Implemented (Feb 2026)
- ✅ Cinematic Hero with 3 floating phone mockups, gradient headline, particle field, marquee strip
- ✅ All 13 sections: Home Dashboard, Nutrition + AI Food Scan, Gym Buddie AI, Workout Planner, Combat Zone, Arena (with realistic Unsplash avatars), Progress Hub w/ Unlock Transformation Mode, Profile (rank card / XP / stats), Creator Program form, Waitlist form, FAQ, Footer
- ✅ Waitlist API (POST + duplicate guard + Resend email)
- ✅ Creator Application API (POST + IG/TikTok required + Resend email)
- ✅ Admin: login, stats (totals + 14-day growth + device split), waitlist table w/ delete, creators list w/ approve/reject/email, broadcast announcements
- ✅ All emails wrapped in branded dark-neon HTML template
- ✅ Mobile responsive + scroll/floating animations everywhere
- ✅ Tested: 100% backend (19/19), 100% frontend flows

## Backlog (P1)
- Verified Resend sender domain (currently onboarding@resend.dev)
- Live AI chat for Gym Buddie section (Claude/GPT via Universal Key)
- Real Terms / Privacy / Refund policy pages (currently `#` links)
- AI Food Scan demo: working photo→macros via OpenAI vision (deferred per user)

## Backlog (P2)
- Creator duplicate-application guard (testing flagged — currently allowed)
- ADMIN_TOKEN → JWT with expiry & refresh
- Broadcast: concurrent send via asyncio.gather + semaphore for 50k+ lists
- Inline error under admin login input (UX nitpick from test report)
- Convert Discord & TikTok placeholder icons to brand-locked SVGs

## Credentials
- Admin password: `RevengeArc2026!` (also in `/app/memory/test_credentials.md`)
- Resend API key, sender, admin password — all in `/app/backend/.env`
