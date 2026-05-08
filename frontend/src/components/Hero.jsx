import { motion } from "motion/react";
import { ArrowRight, Sparkles, Flame, Trophy } from "lucide-react";
import ParticleField from "./ParticleField";
import PhoneMockup from "./PhoneMockup";
import { MOCKUPS } from "../lib/mockups";

export default function Hero() {
  return (
    <section id="top" className="relative pt-28 pb-12 sm:pb-16 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="orb orb-purple w-[600px] h-[600px] -top-40 -left-40 opacity-40" />
      <div className="orb orb-cyan w-[500px] h-[500px] top-20 -right-32 opacity-30" />
      <div className="orb orb-pink w-[400px] h-[400px] bottom-0 left-1/3 opacity-25" />
      <ParticleField density={90} color="168, 85, 247" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
        {/* Left: Copy */}
        <div className="lg:col-span-7 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm"
            data-testid="hero-badge"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-300" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-purple-200">EARLY ACCESS · 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display font-black text-5xl sm:text-7xl lg:text-[88px] leading-[0.95] tracking-tight"
            data-testid="hero-headline"
          >
            Discipline <br />
            Built <span className="gradient-text">Different.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-7 text-lg sm:text-xl text-white/65 max-w-xl leading-relaxed"
            data-testid="hero-subheadline"
          >
            The all-in-one AI self-improvement system built to transform your body, mindset, discipline, and lifestyle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-9 flex flex-wrap items-center gap-3.5"
          >
            <a href="#waitlist" className="btn-primary" data-testid="hero-waitlist-cta">
              <Flame className="h-4 w-4" />
              Join Waitlist
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#creator" className="btn-ghost" data-testid="hero-creator-cta">
              <Trophy className="h-4 w-4 text-amber-400" />
              Apply for Creator Program
            </a>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-12 grid grid-cols-3 gap-2.5 sm:gap-4 max-w-lg"
          >
            {[
              { v: "AI", l: "Powered" },
              { v: "Smooth", l: "Tracking" },
              { v: "Built", l: "Different" },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl px-3 sm:px-4 py-3.5 sm:py-4 min-w-0">
                <div className="font-display font-extrabold text-base sm:text-lg lg:text-xl text-white whitespace-nowrap">{s.v}</div>
                <div className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] text-white/45 mt-1 truncate">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Floating phone stack */}
        <div className="lg:col-span-5 relative h-[640px] sm:h-[720px] hidden md:block">
          {/* Glow ring behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[460px] w-[460px] rounded-full border border-purple-500/20 pulse-glow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-cyan-400/10" />

          <PhoneMockup
            src={MOCKUPS.home}
            alt="Revenge Arc Home Dashboard"
            className="absolute top-2 right-6 w-[260px] sm:w-[300px] z-30"
            rotate={-4}
            glow="purple"
            delay={0.2}
          />
          <PhoneMockup
            src={MOCKUPS.workout}
            alt="Workout Routine"
            className="absolute top-32 -left-2 w-[220px] sm:w-[250px] z-20 opacity-95"
            rotate={6}
            glow="green"
            floatVariant="slow"
            delay={0.4}
          />
          <PhoneMockup
            src={MOCKUPS.arena}
            alt="The Arena"
            className="absolute bottom-2 right-0 w-[220px] sm:w-[250px] z-10 opacity-95"
            rotate={-7}
            glow="pink"
            floatVariant="tilt"
            delay={0.6}
          />
        </div>

        {/* Mobile phone */}
        <div className="md:hidden mt-10 flex justify-center">
          <PhoneMockup src={MOCKUPS.home} alt="Home" className="w-[260px]" glow="purple" />
        </div>
      </div>

      {/* Compact ribbon — directly transitions into dashboard, no dead space */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="relative mt-14 sm:mt-16 border-y border-white/8 bg-[#05050a]/60 overflow-hidden"
      >
        <div className="marquee py-3.5 text-xs font-bold tracking-[0.4em] text-white/35 uppercase">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-10 px-6">
              {["Disciplined", "Cinematic", "AI Powered", "Built Different", "No Excuses", "Movement", "Earned Not Given", "Warrior Mode"].map((w, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-10">
                  {w}
                  <span className="h-1 w-1 rounded-full bg-purple-500" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
