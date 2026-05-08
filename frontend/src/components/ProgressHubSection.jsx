import { motion } from "motion/react";
import { Zap, Camera, TrendingUp, FileText, BarChart3, Film, FileBarChart, Shield, Clock, Lock } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import SectionHeader from "./SectionHeader";
import { MOCKUPS } from "../lib/mockups";

const trackers = [
  { icon: Zap, title: "Form Lab (AI)", sub: "Record any lift, get AI feedback", color: "purple" },
  { icon: Camera, title: "Photo Progress", sub: "Visual transformation over time", color: "purple" },
  { icon: Film, title: "Photo Progress AI", sub: "AI physique analysis", color: "purple" },
  { icon: TrendingUp, title: "Weight Tracker", sub: "Daily measurements", color: "cyan" },
  { icon: FileText, title: "Progress Notes", sub: "Journal your journey", color: "pink" },
  { icon: BarChart3, title: "Workout Analytics", sub: "Performance metrics", color: "pink" },
];

const special = [
  { icon: Film, title: "Revenge Arc Story", sub: "Cinematic journey", color: "purple" },
  { icon: FileBarChart, title: "Weekly Report", sub: "AI-powered progress summary", color: "purple" },
  { icon: Shield, title: "Discipline Meter", sub: "15/100 warrior score", color: "green" },
  { icon: Clock, title: "Progress Timeline", sub: "Time-travel through your journey", color: "purple" },
];

const colorMap = {
  purple: "border-purple-500/30 bg-purple-500/8 text-purple-300",
  cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  pink: "border-pink-500/30 bg-pink-500/8 text-pink-300",
  green: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
};

export default function ProgressHubSection() {
  return (
    <section id="progress" className="relative py-28 sm:py-36 overflow-hidden" data-testid="section-progress">
      <div className="orb orb-purple w-[600px] h-[600px] -top-32 -right-40 opacity-25" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          kicker="PROGRESS HUB"
          title={<>Every detail matters <br/>on your <span className="gradient-text">journey.</span></>}
          subtitle="Form Lab, photo progress, weight tracking, AI analysis, weekly reports — your entire transformation in one cinematic dashboard."
          align="center"
        />

        <div className="mt-16 grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex justify-center order-2 lg:order-1">
            <div className="space-y-6">
              <PhoneMockup src={MOCKUPS.progressHub} alt="Progress Hub" className="w-[260px] sm:w-[300px]" glow="purple" />
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-10">
            <div>
              <div className="text-xs tracking-[0.35em] font-bold text-white/55 mb-4">CORE TRACKERS</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {trackers.map((t, i) => (
                  <motion.div
                    key={t.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className={`flex items-center gap-3 rounded-2xl border p-4 hover:translate-y-[-3px] transition ${colorMap[t.color]}`}
                  >
                    <div className={`h-10 w-10 rounded-xl border grid place-items-center flex-shrink-0 ${colorMap[t.color]}`}>
                      <t.icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm">{t.title}</div>
                      <div className="text-xs text-white/55 truncate">{t.sub}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-xs tracking-[0.35em] font-bold text-white/55">REVENGE ARC</div>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/25 border border-purple-500/40 text-purple-200 text-[10px] font-bold tracking-wider">SPECIAL</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {special.map((t, i) => (
                  <motion.div
                    key={t.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className={`flex items-center gap-3 rounded-2xl border p-4 hover:translate-y-[-3px] transition ${colorMap[t.color]}`}
                  >
                    <div className={`h-10 w-10 rounded-xl border grid place-items-center flex-shrink-0 ${colorMap[t.color]}`}>
                      <t.icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm">{t.title}</div>
                      <div className="text-xs text-white/55 truncate">{t.sub}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Unlock Transformation */}
            <UnlockTransformation />
          </div>
        </div>
      </div>
    </section>
  );
}

function UnlockTransformation() {
  const stages = [
    { label: "Workout Days", value: 20, total: 30 },
    { label: "Nutrition Days", value: 25, total: 30 },
    { label: "Check-In Days", value: 26, total: 30 },
    { label: "Active Days", value: 27, total: 30 },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/35 via-purple-950/20 to-[#0a0814] p-6 relative overflow-hidden"
      data-testid="unlock-transformation"
    >
      <div className="absolute -top-20 -right-20 h-60 w-60 bg-purple-500/30 blur-3xl rounded-full" />
      <div className="relative flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-purple-500/20 border border-purple-500/40 grid place-items-center glow-purple">
          <Lock className="h-5 w-5 text-purple-200" />
        </div>
        <div className="flex-1">
          <div className="font-display font-extrabold text-2xl">Unlock Transformation Mode</div>
          <p className="text-white/55 text-sm mt-1">Your cinematic Revenge Arc breakdown — unlocks after 30 days of real tracked effort.</p>
        </div>
      </div>

      <div className="mt-6 space-y-3.5">
        {stages.map((s, i) => (
          <div key={s.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/75">{s.label}</span>
              <span className="font-bold text-white">{s.value} / {s.total}</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(s.value / s.total) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400"
                style={{ boxShadow: "0 0 14px rgba(168,85,247,0.6)" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] tracking-[0.3em] text-white/45 font-bold">OVERALL UNLOCK PROGRESS</div>
          <div className="font-display font-extrabold text-4xl gradient-text">81%</div>
        </div>
        <button className="btn-primary">View Requirements</button>
      </div>
    </motion.div>
  );
}
