import { motion } from "motion/react";
import { CheckCircle2, AlertCircle, Moon, Dumbbell } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import SectionHeader from "./SectionHeader";
import { MOCKUPS } from "../lib/mockups";

const week = [
  { day: "SUN", title: "Rest Day", sub: "Recovery & mobility", icon: Moon, color: "cyan", status: "rest" },
  { day: "MON", title: "Chest & Triceps", sub: "Chest, Triceps · 6 exercises · ~55 min", icon: AlertCircle, color: "amber", status: "missed" },
  { day: "TUE", title: "Back & Biceps", sub: "Back, Biceps · 6 exercises · ~50 min", icon: CheckCircle2, color: "green", status: "done" },
  { day: "WED", title: "Legs", sub: "Quads, Hamstrings, Glutes, Calves · 5 ex · ~45 min", icon: CheckCircle2, color: "green", status: "done" },
  { day: "THU", title: "Shoulders & Abs", sub: "Shoulders, Abs · 5 ex · ~40 min", icon: CheckCircle2, color: "purple", status: "today" },
  { day: "FRI", title: "Full Body", sub: "Chest, Legs, Back · 6 ex · ~60 min", icon: Dumbbell, color: "neutral", status: "upcoming" },
];

const colors = {
  cyan: { ring: "border-cyan-500/40", bg: "bg-cyan-500/8", text: "text-cyan-300", chip: "bg-cyan-500/20 text-cyan-200" },
  amber: { ring: "border-amber-500/50", bg: "bg-amber-500/8", text: "text-amber-300", chip: "bg-amber-500/20 text-amber-200" },
  green: { ring: "border-emerald-500/40", bg: "bg-emerald-500/8", text: "text-emerald-300", chip: "bg-emerald-500/20 text-emerald-200" },
  purple: { ring: "border-purple-500/50", bg: "bg-purple-500/8", text: "text-purple-300", chip: "bg-purple-500/20 text-purple-200" },
  neutral: { ring: "border-white/15", bg: "bg-white/4", text: "text-white/70", chip: "bg-white/10 text-white/70" },
};

const statusBadge = {
  rest: null,
  missed: "MISSED",
  done: "DONE",
  today: "TODAY",
  upcoming: null,
};

export default function WorkoutSection() {
  return (
    <section id="workout" className="relative py-28 sm:py-36 overflow-hidden" data-testid="section-workout">
      <div className="orb orb-cyan w-[500px] h-[500px] -bottom-32 -right-40 opacity-25" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6">
          <SectionHeader
            kicker="WORKOUT PLANNER"
            title={<>Beast Mode <span className="gradient-cyan">Unleashed.</span></>}
            subtitle="Your weekly split, alive. Hit your sessions, miss them, or rest — every day is logged with cinematic precision."
          />

          <div className="mt-6 glass rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs">
              <span className="tracking-[0.3em] text-white/50 font-bold">THIS WEEK</span>
              <span className="text-purple-300 font-bold">4/5 workouts</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "80%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                style={{ boxShadow: "0 0 16px rgba(34,197,94,0.5)" }}
              />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {week.map((w, i) => {
              const c = colors[w.color];
              return (
                <motion.div
                  key={w.day}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className={`group flex items-center gap-4 rounded-2xl border ${c.ring} ${c.bg} p-4 hover:translate-y-[-2px] transition-transform`}
                  data-testid={`week-day-${w.day.toLowerCase()}`}
                >
                  <div className={`h-12 w-12 rounded-xl border ${c.ring} ${c.bg} grid place-items-center`}>
                    <w.icon className={`h-5 w-5 ${c.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] tracking-[0.3em] font-bold ${c.text}`}>{w.day}</span>
                      {statusBadge[w.status] && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold tracking-wider ${c.chip}`}>
                          {statusBadge[w.status]}
                        </span>
                      )}
                    </div>
                    <div className="font-display font-extrabold text-white text-lg leading-tight mt-0.5">{w.title}</div>
                    <div className="text-xs text-white/50 mt-0.5 truncate">{w.sub}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-6 flex justify-center">
          <div className="relative">
            <div className="orb orb-cyan w-[300px] h-[300px] -top-12 -right-12 opacity-50" />
            <PhoneMockup src={MOCKUPS.workout} alt="Workout Routine" className="w-[290px] sm:w-[340px]" glow="cyan" floatVariant="slow" />
          </div>
        </div>
      </div>
    </section>
  );
}
