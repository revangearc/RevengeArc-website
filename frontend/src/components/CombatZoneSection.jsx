import { motion } from "motion/react";
import { Sparkles, Dumbbell, Timer, Trash2, Plus } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import SectionHeader from "./SectionHeader";
import { MOCKUPS } from "../lib/mockups";

const sets = [
  { n: 1, reps: 9, lbs: 185, vol: 1665 },
  { n: 2, reps: 8, lbs: 185, vol: 1480 },
  { n: 3, reps: 7, lbs: 185, vol: 1295 },
];

export default function CombatZoneSection() {
  return (
    <section id="combat" className="relative py-28 sm:py-36 overflow-hidden" data-testid="section-combat">
      <div className="orb orb-pink w-[500px] h-[500px] -top-20 -left-32 opacity-30" />
      <div className="orb orb-cyan w-[400px] h-[400px] -bottom-32 -right-40 opacity-25" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          kicker="COMBAT ZONE"
          variant="swoop"
          title={<>Live battle. <span className="gradient-cyan">Real reps.</span></>}
          subtitle="Track every set, every rep, every pound — with AI advice and PR detection that hits harder than your last lift."
          align="center"
        />

        <div className="mt-16 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <PhoneMockup src={MOCKUPS.combat} alt="Combat Zone" className="w-[280px] sm:w-[330px]" glow="pink" />
          </div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="glass rounded-3xl p-6 relative overflow-hidden"
            >
              {/* Live battle banner */}
              <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-red-900/40 to-transparent pointer-events-none" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold tracking-[0.3em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 pulse-glow" />
                  LIVE BATTLE
                </div>
                <div className="text-xs text-white/50">11 exercises logged</div>
              </div>
              <h3 className="font-display font-extrabold text-3xl mt-2">In Combat</h3>

              <div className="mt-6 rounded-2xl border border-purple-500/25 bg-purple-500/5 p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl border border-cyan-500/40 bg-cyan-500/10 grid place-items-center">
                      <Dumbbell className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div>
                      <div className="text-[10px] tracking-[0.3em] text-cyan-300 font-bold">CHEST</div>
                      <div className="font-display font-extrabold text-xl text-white">Barbell Bench Press</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-bold">Last: 7×185</span>
                    <span className="px-2.5 py-1 rounded-md bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold">PR: 185</span>
                  </div>
                </div>

                {/* Set rows */}
                <div className="mt-5 space-y-2">
                  {sets.map((s, i) => (
                    <motion.div
                      key={s.n}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.45 }}
                      className="grid grid-cols-[40px_1fr_1fr_1fr_36px] gap-2 items-center"
                    >
                      <div className="h-9 w-9 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-200 font-bold grid place-items-center">
                        {s.n}
                      </div>
                      <Cell label="REPS" value={s.reps} />
                      <Cell label="LBS" value={s.lbs} />
                      <Cell label="VOL" value={s.vol} highlight />
                      <button className="h-9 w-9 rounded-full bg-red-500/15 border border-red-500/30 grid place-items-center text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <button className="mt-3 w-full h-11 rounded-xl border border-cyan-500/35 bg-cyan-500/5 text-cyan-300 font-bold flex items-center justify-center gap-2 hover:bg-cyan-500/10 transition">
                  <Plus className="h-4 w-4" /> Add Set
                </button>

                {/* AI advice */}
                <div className="mt-5 rounded-xl border border-purple-500/30 bg-purple-500/8 p-4 flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-300 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/80 leading-relaxed">
                    <span className="text-purple-300 font-bold">AI Advice — </span>
                    Warm up with 2 sets of 10 reps at 135 lbs, focusing on form. For working sets, aim for 3×8 at 185 lbs.
                  </p>
                </div>

                {/* Rest timers */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {["60s", "90s", "2m"].map((t) => (
                    <button key={t} className="h-10 rounded-lg border border-purple-500/25 bg-purple-500/5 text-purple-200 font-bold text-sm flex items-center justify-center gap-2 hover:bg-purple-500/10">
                      <Timer className="h-3.5 w-3.5" /> {t}
                    </button>
                  ))}
                </div>
              </div>

              <button className="mt-5 w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold glow-cyan flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white" /> Complete Battle
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Cell({ label, value, highlight }) {
  return (
    <div className={`rounded-xl border ${highlight ? "border-cyan-500/30 bg-cyan-500/5" : "border-white/10 bg-white/4"} px-3 py-2`}>
      <div className="text-[9px] tracking-widest text-white/45 font-bold">{label}</div>
      <div className={`font-display font-bold text-base ${highlight ? "text-cyan-300" : "text-white"}`}>{value}</div>
    </div>
  );
}
