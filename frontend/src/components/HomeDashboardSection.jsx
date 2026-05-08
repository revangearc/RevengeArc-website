import { motion } from "motion/react";
import { Flame, Calendar, Trophy, CheckCircle2, Quote } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import SectionHeader from "./SectionHeader";
import { MOCKUPS } from "../lib/mockups";

const features = [
  { icon: Flame, label: "Streak System", desc: "Daily fire that compounds — break it and you fall back.", color: "text-cyan-300", bg: "border-cyan-500/30 bg-cyan-500/5" },
  { icon: Calendar, label: "Check-In Calendar", desc: "Visualize every day you showed up. Or didn't.", color: "text-purple-300", bg: "border-purple-500/30 bg-purple-500/5" },
  { icon: Trophy, label: "72-Hour Challenges", desc: "Limited-time XP gauntlets. Reward earned, not given.", color: "text-amber-300", bg: "border-amber-500/30 bg-amber-500/5" },
  { icon: Quote, label: "Quote of the Day", desc: "Cinematic motivation drops every morning.", color: "text-pink-300", bg: "border-pink-500/30 bg-pink-500/5" },
];

export default function HomeDashboardSection() {
  return (
    <section id="dashboard" className="relative py-28 sm:py-36 overflow-hidden" data-testid="section-dashboard">
      <div className="orb orb-purple w-[500px] h-[500px] -top-20 -left-40 opacity-30" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <SectionHeader
            kicker="HOME DASHBOARD"
            title={<>Rise again. <span className="gradient-text">Every day.</span></>}
            subtitle="A cinematic command center built around streaks, vows, and the quiet violence of daily discipline."
          />

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative glass rounded-2xl p-5 ${f.bg} hover:translate-y-[-4px] transition-transform duration-300`}
                data-testid={`dashboard-feature-${i}`}
              >
                <div className={`h-10 w-10 rounded-xl border ${f.bg} grid place-items-center mb-3`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <div className="font-bold text-white">{f.label}</div>
                <div className="text-sm text-white/55 mt-1">{f.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <StatBlock value="110" label="DAY STREAK" color="cyan" />
            <StatBlock value="15" label="WEEKS" color="purple" />
            <StatBlock value="+200" label="XP TODAY" color="amber" />
          </div>
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2 relative flex justify-center">
          <div className="absolute inset-0 dots opacity-50" />
          <div className="relative">
            <div className="orb orb-cyan w-[300px] h-[300px] -top-10 -left-10 opacity-50" />
            <PhoneMockup
              src={MOCKUPS.home}
              alt="Home dashboard"
              className="w-[280px] sm:w-[330px] relative z-10"
              glow="purple"
            />
            <FloatingChip
              text="Broken Vow I"
              accent="red"
              className="absolute top-12 -right-8 sm:-right-12"
              delay={0.3}
            />
            <FloatingChip
              text="6 / 6 days · ON ARC"
              accent="cyan"
              className="absolute bottom-24 -left-6 sm:-left-12"
              delay={0.6}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBlock({ value, label, color = "purple" }) {
  const ring =
    color === "cyan" ? "border-cyan-500/30 text-cyan-300"
    : color === "amber" ? "border-amber-500/30 text-amber-300"
    : "border-purple-500/30 text-purple-300";
  return (
    <div className={`glass rounded-xl px-4 py-4 border ${ring.split(" ")[0]}`}>
      <div className={`font-display font-extrabold text-2xl ${ring.split(" ")[1]}`}>{value}</div>
      <div className="text-[10px] tracking-[0.3em] text-white/45 mt-1">{label}</div>
    </div>
  );
}

function FloatingChip({ text, accent = "purple", className = "", delay = 0 }) {
  const c =
    accent === "red" ? { bg: "bg-red-500/15", border: "border-red-500/40", text: "text-red-300", dot: "bg-red-500" }
    : accent === "cyan" ? { bg: "bg-cyan-500/12", border: "border-cyan-400/40", text: "text-cyan-200", dot: "bg-cyan-400" }
    : { bg: "bg-purple-500/15", border: "border-purple-500/40", text: "text-purple-200", dot: "bg-purple-400" };
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7 }}
      className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full border ${c.border} ${c.bg} backdrop-blur-md ${className} float-y-slow`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot} pulse-glow`} />
      <span className={`text-xs font-semibold ${c.text}`}>{text}</span>
    </motion.div>
  );
}
