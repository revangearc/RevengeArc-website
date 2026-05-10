import { motion } from "motion/react";
import { Flame, Wheat, Pizza, Droplets } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import SectionHeader from "./SectionHeader";
import { MOCKUPS } from "../lib/mockups";

const macros = [
  { icon: Flame, label: "Calories", value: "2,645", goal: "3,050", percent: 87, color: "purple", bar: "from-purple-500 to-fuchsia-400", glow: "rgba(168,85,247,0.5)" },
  { icon: Droplets, label: "Protein", value: "123g", goal: "210g", percent: 59, color: "cyan", bar: "from-cyan-400 to-teal-300", glow: "rgba(34,211,238,0.5)" },
  { icon: Wheat, label: "Carbs", value: "325g", goal: "380g", percent: 86, color: "amber", bar: "from-amber-500 to-orange-400", glow: "rgba(245,158,11,0.5)" },
  { icon: Pizza, label: "Fat", value: "52g", goal: "90g", percent: 58, color: "pink", bar: "from-pink-500 to-fuchsia-400", glow: "rgba(236,72,153,0.5)" },
];

export default function NutritionSection() {
  return (
    <section id="nutrition" className="relative py-28 sm:py-36 overflow-hidden" data-testid="section-nutrition">
      <div className="orb orb-amber w-[400px] h-[400px] top-1/4 -right-32 opacity-25" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          kicker="NUTRITION"
          variant="swoop"
          title={<>Track every <span className="gradient-amber">macro</span>. Crush every goal.</>}
          subtitle="Calories, protein, carbs, fat, hydration — all weaponized into a system that adapts to your goal in real time."
          align="center"
        />

        <div className="mt-16 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex justify-center order-1">
            <div className="relative">
              <div className="orb orb-purple w-[280px] h-[280px] -top-10 -right-10 opacity-50" />
              <PhoneMockup src={MOCKUPS.nutrition} alt="Nutrition" className="w-[280px] sm:w-[320px]" glow="purple" />
            </div>
          </div>

          <div className="lg:col-span-7 order-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {macros.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="glass rounded-2xl p-5 sm:p-6 hover:scale-[1.02] transition"
                style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 0 35px ${m.glow}` }}
                data-testid={`macro-card-${m.label.toLowerCase()}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-9 w-9 rounded-xl border border-${m.color}-500/40 bg-${m.color}-500/10 grid place-items-center`}>
                      <m.icon className={`h-4.5 w-4.5 text-${m.color}-300`} />
                    </div>
                    <div className="text-xs tracking-[0.25em] font-bold text-white/55">{m.label.toUpperCase()}</div>
                  </div>
                  <div className={`text-lg font-display font-extrabold gradient-${m.color === "amber" ? "amber" : m.color === "cyan" ? "cyan" : "text"}`}>{m.percent}%</div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <div className="font-display font-extrabold text-3xl">{m.value}</div>
                  <div className="text-sm text-white/40">/ {m.goal}</div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${m.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full bg-gradient-to-r ${m.bar}`}
                    style={{ boxShadow: `0 0 12px ${m.glow}` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AIFoodScanCard_unused() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative mt-24 grid lg:grid-cols-12 gap-10 items-center glass rounded-3xl p-6 sm:p-10 overflow-hidden"
      data-testid="ai-food-scan-card"
    >
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="orb orb-cyan w-[400px] h-[400px] -top-32 -right-32 opacity-40" />

      <div className="lg:col-span-7 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-200 text-[11px] font-bold tracking-[0.3em]">
          AI FOOD SCAN
        </div>
        <h3 className="font-display font-extrabold text-3xl sm:text-5xl mt-5 leading-tight">
          Point. Scan. <span className="gradient-cyan">Tracked.</span>
        </h3>
        <p className="mt-4 text-white/60 text-base sm:text-lg max-w-xl">
          Snap a photo, scan a barcode, or speak it. Our AI vision engine breaks down macros, ingredients, and confidence — all in under 2 seconds.
        </p>

        <div className="mt-7 grid sm:grid-cols-3 gap-3">
          {[
            { l: "Photo Scan", v: "AI Vision" },
            { l: "Barcode", v: "10M+ DB" },
            { l: "Voice Log", v: "Hands-free" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-3">
              <div className="text-[10px] tracking-[0.3em] text-cyan-300/80 font-bold">{s.l.toUpperCase()}</div>
              <div className="font-display font-bold text-white mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 relative z-10">
        <div className="relative rounded-2xl overflow-hidden glass-cyan p-5 aspect-[4/5] max-w-[340px] mx-auto">
          <div className="scan-line" />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-red-500/40 bg-red-500/15">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 pulse-glow" />
              <span className="text-[9px] font-bold tracking-[0.2em] text-red-200">SCANNING</span>
            </div>
            <div className="text-[10px] tracking-[0.2em] text-cyan-200/80 font-mono">CONFIDENCE 0.94</div>
          </div>

          <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/90 to-transparent">
            <div className="text-[10px] tracking-[0.3em] text-cyan-300/80 font-bold">DETECTED</div>
            <div className="font-display font-extrabold text-2xl text-white mt-1">Grilled Chicken Bowl</div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[["Cal", "612"], ["Prot", "48g"], ["Carb", "54g"]].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-white/5 border border-white/10 px-2 py-1.5">
                  <div className="text-[9px] tracking-widest text-white/45 font-bold">{k.toUpperCase()}</div>
                  <div className="font-display font-bold text-white">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Targeting reticle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 border-2 border-cyan-400/60 rounded-2xl">
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-300" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-300" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-300" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
