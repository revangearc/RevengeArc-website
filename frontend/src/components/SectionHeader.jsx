import { motion } from "motion/react";

export default function SectionHeader({ kicker, title, subtitle, accent = "purple", align = "left" }) {
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
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2.5 mb-5 text-xs font-bold tracking-[0.35em] ${accentColor}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${accentDot} pulse-glow`} />
          {kicker}
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 text-base sm:text-lg text-white/60 max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
