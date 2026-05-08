import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import SectionHeader from "./SectionHeader";

const items = [
  { q: "When is Revenge Arc launching?", a: "We're in private beta now. Join the waitlist to lock in early access — first wave drops to early signups before public release." },
  { q: "Is the AI actually intelligent?", a: "Gym Buddie is built on top of frontier models, fine-tuned on training science. It knows your stats, your goals, your history — and adapts." },
  { q: "Will the app be free?", a: "Core tracking, the Arena, and a baseline AI tier will be free. Premium unlocks include Form Lab AI, photo physique analysis, weekly AI reports, and unlimited coach chats." },
  { q: "Is it on iPhone and Android?", a: "Yes. iOS is shipping first, Android follows shortly after. Pick your device on the waitlist form." },
  { q: "How does the Creator Program work?", a: "Manual review only. Approved creators get paid partnerships, brand assets, early access, and a direct line with our team." },
  { q: "What happens if I miss a day?", a: "You get a Broken Vow notification. Streaks reset, but the Discipline Meter remembers. The arc never ends — start it again." },
];

export default function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative py-28 sm:py-36 overflow-hidden" data-testid="section-faq">
      <div className="orb orb-purple w-[400px] h-[400px] -top-20 -right-20 opacity-25" />
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <SectionHeader kicker="FAQ" title={<>Questions, <span className="gradient-text">answered.</span></>} subtitle="Everything you wanted to know before joining the arc." align="center" />

        <div className="mt-12 space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className={`glass rounded-2xl border ${isOpen ? "border-purple-500/45" : "border-white/8"} overflow-hidden transition`}
                data-testid={`faq-item-${i}`}
              >
                <button
                  className="w-full flex items-center justify-between px-5 sm:px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="font-display font-bold text-base sm:text-lg pr-4">{it.q}</span>
                  <span className={`h-8 w-8 rounded-full border grid place-items-center flex-shrink-0 transition ${isOpen ? "border-purple-500/50 bg-purple-500/15 text-purple-300" : "border-white/15 text-white/50"}`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 text-white/65 text-sm sm:text-base leading-relaxed">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
