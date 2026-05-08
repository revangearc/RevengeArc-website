import { useState } from "react";
import { motion } from "motion/react";
import { Check, Sparkles, ArrowRight, Flame, Zap, Trophy } from "lucide-react";
import SectionHeader from "./SectionHeader";

const FREE_FEATURES = [
  "Basic workout tracking",
  "Limited progress tools",
  "Limited community access",
];

const PREMIUM_FEATURES = [
  "Full Gym Buddie AI coach",
  "AI workout builder",
  "AI food scan + macro help",
  "Body progress AI analysis",
  "Weekly AI reports",
  "Advanced trackers",
  "Full rank system",
  "Premium challenges",
  "Full progress analytics",
  "Arena / community access",
  "Transformation tracking",
  "Priority access to future AI features",
];

export default function PricingSection() {
  const [yearly, setYearly] = useState(true);
  const monthly = 15.99;
  const yearlyOriginal = 191.88;
  const yearlyDiscounted = 115.99;
  const savings = (yearlyOriginal - yearlyDiscounted).toFixed(2);
  const savingsPct = Math.round(((yearlyOriginal - yearlyDiscounted) / yearlyOriginal) * 100);

  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden" data-testid="section-pricing">
      <div className="orb orb-purple w-[600px] h-[600px] -top-32 left-1/4 opacity-25" />
      <div className="orb orb-cyan w-[400px] h-[400px] bottom-0 -right-32 opacity-20" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          kicker="PRICING"
          title={<>Choose your <span className="gradient-text">arc.</span></>}
          subtitle="Free to start. Upgrade when you're ready to weaponize the full system."
          align="center"
        />

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 flex justify-center"
        >
          <div className="inline-flex items-center gap-1 p-1 rounded-full glass border border-purple-500/25" data-testid="billing-toggle">
            {[
              { id: false, label: "Monthly" },
              { id: true, label: "Yearly" },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setYearly(opt.id)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition relative ${
                  yearly === opt.id
                    ? "bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white glow-purple"
                    : "text-white/60 hover:text-white"
                }`}
                data-testid={`billing-${opt.label.toLowerCase()}`}
              >
                {opt.label}
                {opt.id && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold tracking-wider">
                    -{savingsPct}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <div className="mt-12 grid md:grid-cols-2 gap-5 lg:gap-6 max-w-5xl mx-auto">
          {/* FREE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass rounded-3xl p-6 sm:p-8 relative"
            data-testid="pricing-free"
          >
            <div className="text-[11px] tracking-[0.3em] text-white/55 font-bold flex items-center gap-2">
              <Flame className="h-3.5 w-3.5" /> FREE FOREVER
            </div>
            <h3 className="font-display font-extrabold text-3xl mt-3">Starter</h3>
            <p className="text-white/55 text-sm mt-1">Begin your arc with the core experience.</p>

            <div className="mt-6 flex items-baseline gap-2">
              <div className="font-display font-extrabold text-5xl">$0</div>
              <div className="text-white/45 text-sm">forever</div>
            </div>

            <ul className="mt-7 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-white/80">
                  <span className="mt-0.5 h-5 w-5 rounded-full border border-white/15 bg-white/4 grid place-items-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white/70" />
                  </span>
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>

            <a href="#waitlist" className="mt-8 btn-ghost w-full justify-center" data-testid="pricing-free-cta">
              Get Started <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* PREMIUM */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400 overflow-hidden"
            data-testid="pricing-premium"
          >
            {/* Glow */}
            <div className="absolute -top-20 -right-20 h-60 w-60 bg-purple-500/40 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 bg-cyan-500/30 blur-3xl rounded-full pointer-events-none" />

            <div className="relative rounded-3xl bg-gradient-to-br from-[#0d0a1a] via-[#0c0816] to-[#0a0814] p-6 sm:p-8 h-full">
              {/* Recommended badge */}
              <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white text-[10px] font-bold tracking-[0.3em] glow-purple flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> RECOMMENDED
              </div>

              <div className="text-[11px] tracking-[0.3em] text-purple-300 font-bold flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5" /> PREMIUM ARC
              </div>
              <h3 className="font-display font-extrabold text-3xl mt-3 gradient-text">Warrior</h3>
              <p className="text-white/60 text-sm mt-1">The full Revenge Arc system. Built for transformation.</p>

              {/* Price */}
              <motion.div
                key={yearly ? "y" : "m"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-6"
              >
                {yearly ? (
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-white/35 line-through text-lg font-bold">${yearlyOriginal.toFixed(2)}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold tracking-wider">
                        BEST VALUE · SAVE ${savings}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <div className="font-display font-extrabold text-5xl gradient-text">${yearlyDiscounted}</div>
                      <div className="text-white/45 text-sm">/ year</div>
                    </div>
                    <div className="text-xs text-white/45 mt-1">Just ${(yearlyDiscounted / 12).toFixed(2)}/month — billed annually</div>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <div className="font-display font-extrabold text-5xl">${monthly}</div>
                    <div className="text-white/45 text-sm">/ month</div>
                  </div>
                )}
              </motion.div>

              <ul className="mt-7 grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
                {PREMIUM_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-white/85">
                    <span className="mt-0.5 h-5 w-5 rounded-full border border-purple-500/40 bg-purple-500/15 grid place-items-center flex-shrink-0">
                      <Check className="h-3 w-3 text-purple-300" />
                    </span>
                    <span className="text-[13px]">{f}</span>
                  </li>
                ))}
              </ul>

              <a href="#waitlist" className="mt-8 btn-primary w-full justify-center" data-testid="pricing-premium-cta">
                <Zap className="h-4 w-4" /> Lock In Early Access <ArrowRight className="h-4 w-4" />
              </a>
              <p className="text-center text-[11px] text-white/40 mt-3">
                Subscriptions activate at launch — payments processed in-app.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
