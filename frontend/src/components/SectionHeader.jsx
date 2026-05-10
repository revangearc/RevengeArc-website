import { motion } from "motion/react";

// Distinct cinematic reveal variants per section
const VARIANTS = {
  fade: {
    kicker:   { initial: { opacity: 0, y: 12 }, anim: { opacity: 1, y: 0 }, t: { duration: 0.5 } },
    title:    { initial: { opacity: 0, y: 16 }, anim: { opacity: 1, y: 0 }, t: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
    subtitle: { initial: { opacity: 0, y: 16 }, anim: { opacity: 1, y: 0 }, t: { duration: 0.7, delay: 0.1 } },
  },
  "slide-left": {
    kicker:   { initial: { opacity: 0, x: -28 }, anim: { opacity: 1, x: 0 }, t: { duration: 0.55 } },
    title:    { initial: { opacity: 0, x: -50, filter: "blur(6px)" }, anim: { opacity: 1, x: 0, filter: "blur(0px)" }, t: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
    subtitle: { initial: { opacity: 0, x: -30 }, anim: { opacity: 1, x: 0 }, t: { duration: 0.7, delay: 0.18 } },
  },
  "slide-right": {
    kicker:   { initial: { opacity: 0, x: 28 }, anim: { opacity: 1, x: 0 }, t: { duration: 0.55 } },
    title:    { initial: { opacity: 0, x: 50, filter: "blur(6px)" }, anim: { opacity: 1, x: 0, filter: "blur(0px)" }, t: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
    subtitle: { initial: { opacity: 0, x: 30 }, anim: { opacity: 1, x: 0 }, t: { duration: 0.7, delay: 0.18 } },
  },
  swoop: {
    kicker:   { initial: { opacity: 0, y: -20, rotate: -4 }, anim: { opacity: 1, y: 0, rotate: 0 }, t: { duration: 0.6 } },
    title:    { initial: { opacity: 0, y: -60, scale: 1.06 }, anim: { opacity: 1, y: 0, scale: 1 }, t: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
    subtitle: { initial: { opacity: 0, y: -16 }, anim: { opacity: 1, y: 0 }, t: { duration: 0.7, delay: 0.2 } },
  },
  rise: {
    kicker:   { initial: { opacity: 0, y: 28 }, anim: { opacity: 1, y: 0 }, t: { duration: 0.6 } },
    title:    { initial: { opacity: 0, y: 60, filter: "blur(8px)" }, anim: { opacity: 1, y: 0, filter: "blur(0px)" }, t: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
    subtitle: { initial: { opacity: 0, y: 24 }, anim: { opacity: 1, y: 0 }, t: { duration: 0.75, delay: 0.2 } },
  },
  zoom: {
    kicker:   { initial: { opacity: 0, scale: 0.85 }, anim: { opacity: 1, scale: 1 }, t: { duration: 0.6 } },
    title:    { initial: { opacity: 0, scale: 0.78, filter: "blur(10px)" }, anim: { opacity: 1, scale: 1, filter: "blur(0px)" }, t: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    subtitle: { initial: { opacity: 0, scale: 0.95 }, anim: { opacity: 1, scale: 1 }, t: { duration: 0.7, delay: 0.2 } },
  },
  float: {
    kicker:   { initial: { opacity: 0, y: -10 }, anim: { opacity: 1, y: 0 }, t: { duration: 0.6 } },
    title:    { initial: { opacity: 0, y: -28, rotate: -1 }, anim: { opacity: 1, y: 0, rotate: 0 }, t: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
    subtitle: { initial: { opacity: 0, y: -12 }, anim: { opacity: 1, y: 0 }, t: { duration: 0.7, delay: 0.22 } },
  },
};

export default function SectionHeader({ kicker, title, subtitle, accent = "purple", align = "left", variant = "fade" }) {
  const v = VARIANTS[variant] || VARIANTS.fade;

  const accentColor =
    accent === "cyan" ? "text-cyan-300"
    : accent === "amber" ? "text-amber-400"
    : accent === "green" ? "text-emerald-400"
    : accent === "pink" ? "text-pink-400"
    : "text-purple-400";

  const accentDot =
    accent === "cyan" ? "bg-cyan-400"
    : accent === "amber" ? "bg-amber-400"
    : accent === "green" ? "bg-emerald-400"
    : accent === "pink" ? "bg-pink-400"
    : "bg-purple-400";

  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {kicker && (
        <motion.div
          initial={v.kicker.initial}
          whileInView={v.kicker.anim}
          viewport={{ once: true, margin: "-60px" }}
          transition={v.kicker.t}
          className={`inline-flex items-center gap-2.5 mb-5 text-xs font-bold tracking-[0.35em] ${accentColor}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${accentDot} pulse-glow`} />
          {kicker}
        </motion.div>
      )}
      <motion.h2
        initial={v.title.initial}
        whileInView={v.title.anim}
        viewport={{ once: true, margin: "-60px" }}
        transition={v.title.t}
        className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={v.subtitle.initial}
          whileInView={v.subtitle.anim}
          viewport={{ once: true, margin: "-60px" }}
          transition={v.subtitle.t}
          className="mt-5 text-base sm:text-lg text-white/60 max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
