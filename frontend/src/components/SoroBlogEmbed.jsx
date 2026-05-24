import { useEffect, useRef, useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { motion } from "motion/react";

// Public Soro widget — no secrets. Lazy-loads only when this component mounts.
const SORO_SCRIPT_SRC = "https://app.trysoro.com/api/embed/010625d8-8d48-451f-b0c3-4cdab9a6754e";
const SORO_SCRIPT_ID = "soro-blog-script";

/**
 * SoroBlogEmbed — React-safe wrapper around the Soro embed widget.
 * Can be rendered inline on any page; deduplicates the <script> tag and
 * cleans up on unmount.
 *
 * Props:
 *  - variant: "section" (with section wrapper + heading) or "bare" (just the widget card)
 */
export default function SoroBlogEmbed({ variant = "section" }) {
  const mountRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | loaded | error

  useEffect(() => {
    if (typeof document === "undefined") return;

    let script = document.getElementById(SORO_SCRIPT_ID);
    let createdHere = false;

    if (!script) {
      script = document.createElement("script");
      script.id = SORO_SCRIPT_ID;
      script.src = SORO_SCRIPT_SRC;
      script.defer = true;
      script.async = true;
      script.onload = () => setStatus("loaded");
      script.onerror = () => setStatus("error");
      document.body.appendChild(script);
      createdHere = true;
    } else {
      setStatus("loaded");
    }

    const fallbackTimer = setTimeout(() => {
      if (mountRef.current && mountRef.current.childElementCount === 0) {
        setStatus((prev) => (prev === "loaded" ? "loaded" : "error"));
      }
    }, 8000);

    return () => {
      clearTimeout(fallbackTimer);
      if (createdHere && script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const Card = (
    <div className="glass rounded-3xl p-5 sm:p-8 lg:p-10 relative overflow-hidden">
      <div className="orb orb-purple w-[400px] h-[400px] -top-32 -left-20 opacity-20 pointer-events-none" />

      {status === "loading" && (
        <div className="grid place-items-center py-24 text-white/55" data-testid="blog-loading">
          <Loader2 className="h-7 w-7 animate-spin text-purple-300" />
          <div className="mt-4 text-sm tracking-wider">Loading the journal…</div>
        </div>
      )}

      {status === "error" && (
        <div className="grid place-items-center py-20 text-center" data-testid="blog-error">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 grid place-items-center">
            <BookOpen className="h-6 w-6 text-amber-300" />
          </div>
          <h3 className="font-display font-extrabold text-2xl mt-5">The journal is warming up.</h3>
          <p className="text-white/55 text-sm mt-2 max-w-md">
            We couldn't reach the Soro feed right now. Refresh in a moment, or follow us on Instagram and TikTok for daily drops.
          </p>
        </div>
      )}

      <div ref={mountRef} id="soro-blog" className="soro-blog-container relative z-10" data-testid="soro-blog-mount" />
    </div>
  );

  if (variant === "bare") return Card;

  return (
    <section id="blog" className="relative py-24 sm:py-32 overflow-hidden" data-testid="section-blog">
      <div className="orb orb-purple w-[500px] h-[500px] -top-40 -right-32 opacity-20 pointer-events-none" />
      <div className="orb orb-cyan w-[400px] h-[400px] -bottom-40 -left-32 opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 mb-5">
            <BookOpen className="h-3.5 w-3.5 text-purple-300" />
            <span className="text-[11px] tracking-[0.3em] font-bold text-purple-200">REVENGE ARC JOURNAL</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Field notes from the <span className="gradient-text">arc.</span>
          </h2>
          <p className="text-white/55 text-base sm:text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
            Discipline, training systems, transformation stories, and the unfiltered playbook behind Revenge Arc.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-12 sm:mt-16"
        >
          {Card}
        </motion.div>

        <div className="mt-6 text-center text-xs text-white/40 tracking-wider">
          JOURNAL POWERED BY{" "}
          <a href="https://trysoro.com" target="_blank" rel="noreferrer" className="text-purple-300/80 hover:text-purple-200">
            SORO
          </a>
          {" · "}EDITORIAL BY THE REVENGE ARC TEAM
        </div>
      </div>
    </section>
  );
}
