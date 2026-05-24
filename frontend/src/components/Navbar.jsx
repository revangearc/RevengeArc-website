import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Flame, ChevronDown, Apple, MessageSquare, Dumbbell, Swords, Users, BarChart3, UserCircle2, Camera } from "lucide-react";

const FEATURE_ITEMS = [
  { href: "#dashboard", label: "Home Dashboard", icon: Flame, color: "text-purple-300" },
  { href: "#nutrition", label: "Nutrition", icon: Apple, color: "text-amber-300" },
  { href: "#food-scan", label: "AI Food Scan", icon: Camera, color: "text-pink-300" },
  { href: "#gym-buddie", label: "Gym Buddie AI", icon: MessageSquare, color: "text-purple-300" },
  { href: "#workout", label: "Workout Planner", icon: Dumbbell, color: "text-cyan-300" },
  { href: "#combat", label: "Combat Zone", icon: Swords, color: "text-pink-300" },
  { href: "#arena", label: "Arena", icon: Users, color: "text-fuchsia-300" },
  { href: "#progress", label: "Progress Hub", icon: BarChart3, color: "text-emerald-300" },
  { href: "#profile", label: "Profile", icon: UserCircle2, color: "text-amber-300" },
];

const TOP_LINKS = [
  { href: "#features", label: "Features", dropdown: true },
  { href: "#pricing", label: "Pricing" },
  { href: "/creator", label: "Creators" },
  { href: "/blog", label: "Blog" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // When landing arrives with a hash (e.g. via /#pricing), scroll to it after mount
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.slice(1);
      // Slight delay so the section is rendered + animated
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [location]);

  const goTo = (href) => {
    setOpen(false);
    setFeaturesOpen(false);
    if (href.startsWith("#")) {
      const id = href.slice(1);
      // If we're not on the landing page, navigate home first then scroll
      if (location.pathname !== "/") {
        navigate(`/${href}`);
        return;
      }
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (href.startsWith("/")) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  };

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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-4 gap-4">
        <a href="/" className="flex items-center gap-2.5 group flex-shrink-0" data-testid="brand-logo">
          <span className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-700 grid place-items-center glow-purple">
            <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <div className="leading-tight">
            <div className="font-display font-extrabold text-lg tracking-tight">REVENGE</div>
            <div className="text-[10px] tracking-[0.4em] text-cyan-300/80 -mt-0.5">A R C</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1 mx-auto">
          {TOP_LINKS.map((l) => l.dropdown ? (
            <div key={l.label} className="relative" onMouseEnter={() => setFeaturesOpen(true)} onMouseLeave={() => setFeaturesOpen(false)}>
              <button
                onClick={() => setFeaturesOpen((v) => !v)}
                className="px-3.5 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5 inline-flex items-center gap-1"
                data-testid={`nav-link-${l.label.toLowerCase()}`}
              >
                {l.label}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${featuresOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {featuresOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 pt-2 w-[420px]"
                    data-testid="features-dropdown"
                  >
                    <div className="glass rounded-2xl p-2.5 shadow-2xl border border-purple-500/30">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {FEATURE_ITEMS.map((f) => (
                          <button
                            key={f.href}
                            onClick={() => goTo(f.href)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left group"
                            data-testid={`feature-link-${f.label.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <span className={`h-8 w-8 rounded-lg border border-white/10 bg-white/4 grid place-items-center group-hover:border-purple-500/50 transition`}>
                              <f.icon className={`h-4 w-4 ${f.color}`} />
                            </span>
                            <span className="text-sm font-medium text-white/85">{f.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              key={l.href}
              onClick={() => goTo(l.href)}
              className="px-3.5 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button onClick={() => goTo("/waitlist")} className="hidden sm:inline-flex btn-primary !py-2.5 !px-5 !text-sm" data-testid="nav-waitlist-btn">
            Join Waitlist
          </button>
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
            <div className="px-5 py-4 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
              <div className="text-[10px] tracking-[0.3em] text-white/45 font-bold px-3 mt-1 mb-1">FEATURES</div>
              {FEATURE_ITEMS.map((f) => (
                <button key={f.href} onClick={() => goTo(f.href)} className="flex items-center gap-3 py-2.5 px-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg text-left">
                  <f.icon className={`h-4 w-4 ${f.color}`} />
                  {f.label}
                </button>
              ))}
              <div className="text-[10px] tracking-[0.3em] text-white/45 font-bold px-3 mt-3 mb-1">EXPLORE</div>
              {[{h:"#pricing",l:"Pricing"},{h:"/creator",l:"Creators"},{h:"/blog",l:"Blog"},{h:"#faq",l:"FAQ"}].map(x=>(
                <button key={x.h} onClick={()=>goTo(x.h)} className="py-2.5 px-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg text-left">{x.l}</button>
              ))}
              <button onClick={() => goTo("/waitlist")} className="btn-primary justify-center mt-3">Join Waitlist</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
