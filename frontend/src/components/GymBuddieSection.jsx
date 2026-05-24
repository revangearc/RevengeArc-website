import { motion } from "motion/react";
import { Sparkles, Send, Camera, ArrowUpRight } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import SectionHeader from "./SectionHeader";
import { MOCKUPS } from "../lib/mockups";

const messages = [
  { from: "user", text: "Best cardio for fat loss?" },
  {
    from: "ai",
    text: "Zone 2 cardio 3x/week + 1 HIIT session. Anchors fat oxidation while preserving muscle. Want a 4-week plan?",
  },
  { from: "user", text: "Yes, build it for me." },
  {
    from: "ai",
    text: "On it 🔥 — 4-week progressive plan with intensity zones, recovery markers, and weekly deload. Synced to your Combat schedule.",
  },
];

const prompts = [
  "Best cardio for fat loss?",
  "How to track macros?",
  "What's the best workout split?",
  "Build a 12-week cut for me",
];

export default function GymBuddieSection() {
  return (
    <section id="gym-buddie" className="relative py-28 sm:py-36 overflow-hidden" data-testid="section-gym-buddie">
      <div className="orb orb-purple w-[600px] h-[600px] top-0 -left-40 opacity-30" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative">
            <div className="orb orb-purple w-[260px] h-[260px] -top-6 -left-6 opacity-60" />
            <PhoneMockup src={MOCKUPS.gymBuddie} alt="Gym Buddie AI" className="w-[270px] sm:w-[310px]" glow="purple" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <SectionHeader
            kicker="GYM BUDDIE AI"
            variant="float"
            title={<>Your <span className="gradient-text">personal coach,</span> living in your pocket.</>}
            subtitle="Ask anything — workouts, nutrition, recovery, mindset. Cinematic AI coaching that knows your body, your goal, your arc."
          />

          {/* Mock chat */}
          <div className="mt-10 glass rounded-3xl p-5 sm:p-6 relative overflow-hidden" data-testid="ai-chat-mock">
            <div className="flex items-center gap-3 pb-4 border-b border-white/8">
              <div className="relative h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/40 grid place-items-center glow-purple">
                <Sparkles className="h-5 w-5 text-purple-300" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#0c0a14]" />
              </div>
              <div>
                <div className="font-bold text-white">Gym Buddie</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-glow" />
                  AI Coach · Always Active
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3 max-h-[280px] overflow-hidden">
              {messages.map((m, i) => (
                <motion.div
                  key={`${m.from}-${i}`}
                  initial={{ opacity: 0, x: m.from === "user" ? 16 : -16, y: 10 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.from === "user"
                        ? "bg-gradient-to-br from-purple-500 to-fuchsia-700 text-white"
                        : "bg-white/5 border border-white/10 text-white/85"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-2 gap-2.5">
              {prompts.map((p, i) => (
                <motion.button
                  key={p}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.3 + i * 0.06 }}
                  className="group flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/40 transition text-left"
                  data-testid={`prompt-${i}`}
                >
                  <span className="text-sm text-white/85">{p}</span>
                  <ArrowUpRight className="h-4 w-4 text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </motion.button>
              ))}
            </div>

            {/* Input bar */}
            <div className="mt-5 flex items-center gap-2.5">
              <button className="h-11 w-11 rounded-full bg-purple-500 grid place-items-center glow-purple">
                <Camera className="h-4.5 w-4.5 text-white" />
              </button>
              <div className="flex-1 h-11 rounded-full bg-white/5 border border-white/10 px-4 flex items-center text-sm text-white/40">
                Ask Gym Buddie anything…
              </div>
              <button className="h-11 w-11 rounded-full bg-white/8 border border-white/15 grid place-items-center hover:bg-white/12">
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
