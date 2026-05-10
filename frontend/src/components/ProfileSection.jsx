import { motion } from "motion/react";
import { Trophy, Flame, Shield, Camera, Settings } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import SectionHeader from "./SectionHeader";
import { MOCKUPS } from "../lib/mockups";

export default function ProfileSection() {
  return (
    <section id="profile" className="relative py-28 sm:py-36 overflow-hidden" data-testid="section-profile">
      <div className="orb orb-amber w-[500px] h-[500px] -top-32 -right-40 opacity-25" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6">
          <SectionHeader
            kicker="PROFILE SYSTEM"
            variant="slide-left"
            title={<>Earn your <span className="gradient-amber">rank.</span> Wear it.</>}
            subtitle="XP, ranks, day streaks, weekly score, body stats — every metric that matters lives on a profile that feels like a fighter card."
          />

          <div className="mt-10 space-y-4">
            <RankCard rank="Cursed Spark III" xp={360} nextRank={60} percent={65} />
            <div className="grid grid-cols-2 gap-4">
              <PerformanceCard icon={Flame} title="ACTIVE" value="457" sub="Day Streak" color="green" />
              <PerformanceCard icon={Trophy} title="SCORE" value="1,052" sub="Weekly Score" color="cyan" />
            </div>
            <BodyStats />
          </div>
        </div>

        <div className="lg:col-span-6 flex justify-center">
          <div className="relative">
            <div className="orb orb-amber w-[300px] h-[300px] -top-12 -left-12 opacity-50" />
            <PhoneMockup src={MOCKUPS.profile} alt="Profile" className="w-[280px] sm:w-[330px]" glow="amber" />
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="hidden sm:flex absolute -top-3 -right-6 px-4 py-2.5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/20 to-orange-500/10 backdrop-blur-md float-y-slow items-center gap-2"
            >
              <Shield className="h-4 w-4 text-amber-300" />
              <div>
                <div className="text-[9px] tracking-[0.3em] text-amber-300 font-bold">RANK UP</div>
                <div className="text-xs font-bold text-white">Cursed Spark IV →</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RankCard({ rank, xp, nextRank, percent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-900/30 via-orange-900/15 to-[#0a0814] p-6 relative overflow-hidden"
    >
      <div className="absolute -top-16 -right-16 h-44 w-44 bg-amber-500/30 blur-3xl rounded-full" />
      <div className="relative flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-[11px] tracking-[0.3em] text-amber-300 font-bold">
            <Shield className="h-3.5 w-3.5" /> CURRENT RANK
          </div>
          <div className="font-display font-extrabold text-3xl sm:text-4xl mt-2 leading-none">
            <span className="gradient-amber">{rank}</span>
          </div>
        </div>
        <div className="rank-badge px-4 py-2.5 rounded-xl text-center">
          <div className="font-display font-extrabold text-2xl text-white leading-none">{xp}</div>
          <div className="text-[9px] tracking-[0.25em] text-white/85 font-bold mt-1">TOTAL XP</div>
        </div>
      </div>

      <div className="mt-5 h-2.5 rounded-full bg-black/40 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300"
          style={{ boxShadow: "0 0 14px rgba(245,158,11,0.7)" }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs">
        <span className="text-white/60">{nextRank} XP to next rank</span>
        <span className="text-amber-300 font-bold">{percent}% →</span>
      </div>
    </motion.div>
  );
}

function PerformanceCard({ icon: Icon, title, value, sub, color }) {
  const c = color === "green" ? "from-emerald-900/40 to-[#0a0814] border-emerald-500/35" : "from-cyan-900/40 to-[#0a0814] border-cyan-500/35";
  const text = color === "green" ? "text-emerald-300" : "text-cyan-300";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`rounded-2xl border bg-gradient-to-br ${c} p-5 relative overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <div className={`h-10 w-10 rounded-xl bg-${color === "green" ? "emerald" : "cyan"}-500/15 border border-${color === "green" ? "emerald" : "cyan"}-500/35 grid place-items-center`}>
          <Icon className={`h-4.5 w-4.5 ${text}`} />
        </div>
        <div className={`text-[10px] tracking-[0.3em] font-bold ${text}`}>{title}</div>
      </div>
      <div className="mt-4 font-display font-extrabold text-4xl">{value}</div>
      <div className="text-xs text-white/55 mt-1">{sub}</div>
    </motion.div>
  );
}

function BodyStats() {
  const stats = [
    { l: "WEIGHT", v: "173", sub: "lbs" },
    { l: "HEIGHT", v: "5'10\"", sub: "" },
    { l: "GOAL", v: "CUT", sub: "" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5"
    >
      <div className="text-[11px] tracking-[0.3em] text-purple-300 font-bold mb-4">BODY STATS</div>
      <div className="grid grid-cols-3 divide-x divide-white/10">
        {stats.map((s, i) => (
          <div key={s.l} className={`${i === 0 ? "" : "pl-4"} ${i === 2 ? "" : "pr-4"}`}>
            <div className="text-[10px] tracking-[0.25em] text-white/45 font-bold">{s.l}</div>
            <div className="font-display font-extrabold text-2xl mt-1">
              {s.v} <span className="text-sm text-white/45 font-normal">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
