import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Flame } from "lucide-react";

const links = [
  { href: "#dashboard", label: "Dashboard" },
  { href: "#nutrition", label: "Nutrition" },
  { href: "#coach", label: "Coach" },
  { href: "#workout", label: "Workout" },
  { href: "#combat", label: "Combat" },
  { href: "#arena", label: "Arena" },
  { href: "#progress", label: "Progress" },
  { href: "#profile", label: "Profile" },
  { href: "#creator", label: "Creators" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#05050a]/80 backdrop-blur-xl border-b border-purple-500/15" : "bg-transparent"
      }`}
      data-testid="main-navbar"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-4">
        <a href="#top" className="flex items-center gap-2.5 group" data-testid="brand-logo">
          <span className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-700 grid place-items-center glow-purple">
            <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
            <span className="absolute -inset-1 rounded-xl bg-purple-500/20 blur-md group-hover:opacity-100 opacity-50 transition" />
          </span>
          <div className="leading-tight">
            <div className="font-display font-extrabold text-lg tracking-tight">REVENGE</div>
            <div className="text-[10px] tracking-[0.4em] text-cyan-300/80 -mt-0.5">A R C</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a href="#waitlist" className="hidden sm:inline-flex btn-primary !py-2.5 !px-5 !text-sm" data-testid="nav-waitlist-btn">
            Join Waitlist
          </a>
          <button
            className="lg:hidden h-10 w-10 grid place-items-center rounded-full border border-white/10 bg-white/5"
            onClick={() => setOpen(!open)}
            aria-label="menu"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-purple-500/15 bg-[#05050a]/95 backdrop-blur-xl"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 px-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg"
                  data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                >
                  {l.label}
                </a>
              ))}
              <a href="#waitlist" onClick={() => setOpen(false)} className="btn-primary justify-center mt-2">
                Join Waitlist
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
