import { motion } from "motion/react";
import { Camera, Sparkles, ShieldCheck, ListChecks, Scale, BarChart3 } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import SectionHeader from "./SectionHeader";
import { MOCKUPS } from "../lib/mockups";

const features = [
  { icon: Sparkles, label: "Total Nutrition", value: "1,200 kcal", sub: "P 60g · C 130g · F 50g", color: "purple" },
  { icon: ShieldCheck, label: "AI Confidence", value: "85%", sub: "chicken wings · honey glaze · macaroni", color: "green" },
  { icon: ListChecks, label: "Items Breakdown", value: "2 items", sub: "Honey Wings · Mac & Cheese", color: "pink" },
  { icon: Scale, label: "Portion Estimate", value: "5 pcs · 1.5 cups", sub: "AI-detected from image", color: "purple" },
  { icon: BarChart3, label: "Macro Insight", value: "High-calorie meal", sub: "Low protein · moderate carbs/fat", color: "cyan" },
];

const colorMap = {
  purple: "border-purple-500/30 bg-purple-500/8 text-purple-300",
  cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  pink: "border-pink-500/30 bg-pink-500/8 text-pink-300",
  green: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
};

export default function AIFoodScanSection() {
  return (
    <section id="food-scan" className="relative py-24 sm:py-32 overflow-hidden" data-testid="section-food-scan">
      <div className="orb orb-pink w-[500px] h-[500px] -top-20 -left-32 opacity-25" />
      <div className="orb orb-amber w-[450px] h-[450px] bottom-0 -right-32 opacity-20" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          kicker="AI FOOD SCAN"
          title={<>Snap your meal. <br /><span className="gradient-text">Let AI handle the rest.</span></>}
          subtitle="Real-time AI vision breaks down calories, macros, portions, and ingredients — all from a single photo."
          align="center"
          accent="pink"
        />

        <div className="mt-14 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Phone mockup */}
          <div className="lg:col-span-5 flex justify-center order-1">
            <div className="relative">
              <div className="orb orb-pink w-[280px] h-[280px] -top-10 -right-10 opacity-50" />
              <PhoneMockup
                src={MOCKUPS.foodScan}
                alt="AI Food Scan — Honey Wings and Mac"
                className="w-[280px] sm:w-[320px] relative z-10"
                glow="pink"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="hidden sm:flex absolute -top-3 -left-6 px-3.5 py-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 backdrop-blur-md float-y-slow items-center gap-2"
              >
                <Camera className="h-4 w-4 text-emerald-300" />
                <div>
                  <div className="text-[9px] tracking-[0.3em] text-emerald-300 font-bold">SCANNED</div>
                  <div className="text-xs font-bold text-white">85% confidence</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="lg:col-span-7 order-2 grid sm:grid-cols-2 gap-3.5">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
                className={`glass rounded-2xl p-5 hover:translate-y-[-3px] transition-transform border ${colorMap[f.color].split(" ")[0]} ${i === features.length - 1 ? "sm:col-span-2" : ""}`}
                data-testid={`food-scan-feature-${i}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-xl border grid place-items-center flex-shrink-0 ${colorMap[f.color]}`}>
                    <f.icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] tracking-[0.3em] text-white/55 font-bold">{f.label.toUpperCase()}</div>
                    <div className="font-display font-extrabold text-xl sm:text-2xl text-white mt-1 truncate">{f.value}</div>
                    <div className="text-xs text-white/55 mt-1 truncate">{f.sub}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
