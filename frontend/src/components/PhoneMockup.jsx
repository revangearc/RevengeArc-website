import { motion } from "motion/react";

// PhoneMockup wraps any image in an iPhone-style frame with optional float animation
export default function PhoneMockup({
  src,
  alt = "App screen",
  className = "",
  rotate = 0,
  glow = "purple",
  floatVariant = "y",
  delay = 0,
}) {
  const glowClass =
    glow === "cyan" ? "glow-cyan"
    : glow === "amber" ? "glow-amber"
    : glow === "green" ? "glow-green"
    : glow === "pink" ? "glow-pink"
    : "glow-purple";

  const floatClass = floatVariant === "tilt" ? "float-tilt" : floatVariant === "slow" ? "float-y-slow" : "float-y";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`${className}`}
      data-testid="phone-mockup"
    >
      <div className={`phone-frame ${glowClass} ${floatClass}`}>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-black z-10" />
        <img src={src} alt={alt} loading="lazy" />
      </div>
    </motion.div>
  );
}
