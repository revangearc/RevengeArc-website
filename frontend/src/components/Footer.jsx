import { Flame, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { SOCIALS, SUPPORT_EMAIL } from "../lib/mockups";

const TikTokIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/>
  </svg>
);

const DiscordIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 00-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 00-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" />
  </svg>
);

const cols = [
  {
    title: "Product",
    links: [
      { label: "Home Dashboard", href: "#dashboard" },
      { label: "Nutrition", href: "#nutrition" },
      { label: "AI Food Scan", href: "#food-scan" },
      { label: "Gym Buddie AI", href: "#gym-buddie" },
      { label: "Workout Planner", href: "#workout" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "The Arena", href: "#arena" },
      { label: "Progress Hub", href: "#progress" },
      { label: "Profile System", href: "#profile" },
      { label: "Join Waitlist", to: "/waitlist" },
      { label: "Creator Program", to: "/creator" },
      { label: "Discord", href: SOCIALS.discord, external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Legal Center", to: "/legal" },
      { label: "Terms", to: "/terms" },
      { label: "Privacy", to: "/privacy" },
      { label: "AI & Health Disclaimer", to: "/ai-health-disclaimer" },
      { label: "Community Guidelines", to: "/community-guidelines" },
      { label: "Subscription & Refund Policy", to: "/subscriptions-refunds" },
      { label: "Data Deletion", to: "/data-deletion" },
      { label: "Cookies", to: "/cookies" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-10 border-t border-purple-500/12 overflow-hidden" data-testid="footer">
      <div className="orb orb-purple w-[600px] h-[600px] -top-32 -left-40 opacity-15" />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-700 grid place-items-center glow-purple">
                <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
              </span>
              <div className="leading-tight">
                <div className="font-display font-extrabold text-xl">REVENGE ARC</div>
                <div className="text-[10px] tracking-[0.4em] text-cyan-300/80">DISCIPLINE BUILT DIFFERENT</div>
              </div>
            </a>
            <p className="mt-5 text-white/55 text-sm max-w-md leading-relaxed">
              The all-in-one AI self-improvement system built to transform your body, mindset, discipline, and lifestyle. Built for warriors.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="h-11 w-11 rounded-xl border border-white/15 bg-white/4 grid place-items-center text-white/75 hover:text-white hover:border-pink-500/50 hover:bg-pink-500/10 transition" data-testid="social-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={SOCIALS.tiktok} target="_blank" rel="noreferrer" className="h-11 w-11 rounded-xl border border-white/15 bg-white/4 grid place-items-center text-white/75 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 transition" data-testid="social-tiktok">
                <TikTokIcon className="h-5 w-5" />
              </a>
              <a href={SOCIALS.discord} target="_blank" rel="noreferrer" className="h-11 w-11 rounded-xl border border-white/15 bg-white/4 grid place-items-center text-white/75 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition" data-testid="social-discord">
                <DiscordIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title} className={`${col.title === "Legal" ? "lg:col-span-3" : "lg:col-span-2"} sm:col-span-2`}>
              <div className="text-[11px] tracking-[0.3em] text-white/45 font-bold mb-4">{col.title.toUpperCase()}</div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link to={l.to} className="text-sm text-white/70 hover:text-white transition">{l.label}</Link>
                    ) : (
                      <a
                        href={l.href}
                        target={l.external ? "_blank" : undefined}
                        rel={l.external ? "noreferrer" : undefined}
                        className="text-sm text-white/70 hover:text-white transition"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-1">
            <div className="text-[11px] tracking-[0.3em] text-white/45 font-bold mb-4">ADMIN</div>
            <Link to="/admin" className="text-sm text-white/70 hover:text-white transition" data-testid="footer-admin-link">Console</Link>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2 text-sm text-white/55">
          <Mail className="h-4 w-4 text-purple-300" />
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition" data-testid="footer-support-email">{SUPPORT_EMAIL}</a>
        </div>

        <div className="mt-6 pt-6 border-t border-white/8 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-white/40">© {new Date().getFullYear()} Revenge Arc. Built for warriors.</div>
          <div className="text-xs text-white/40 tracking-[0.3em]">DISCIPLINE · STREAKS · ARCS</div>
        </div>
      </div>
    </footer>
  );
}
