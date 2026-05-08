import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import SectionHeader from "./SectionHeader";

const items = [
  { q: "What is Revenge Arc?", a: "Revenge Arc is a cinematic AI self-improvement platform built around discipline, transformation, and the warrior mindset. It combines workout tracking, nutrition, AI coaching, progress analytics, and community into one unified system." },
  { q: "How is this different from other fitness apps?", a: "Other apps log data. Revenge Arc weaponizes it. Every feature — from streaks to AI form analysis to weekly cinematic reports — is designed to compound discipline and force a real arc, not just a number on a graph." },
  { q: "Is Revenge Arc free?", a: "Yes — the Starter plan is free forever and includes basic workout tracking, limited progress tools, and limited community access." },
  { q: "What does Premium include?", a: "The Warrior plan unlocks the full Gym Buddie AI coach, AI workout builder, AI food scan, weekly AI reports, body progress AI, advanced trackers, the full rank system, premium challenges, and Arena access." },
  { q: "Will new features be added?", a: "Constantly. Premium subscribers get priority access to every new AI module, challenge system, and analytics layer we ship." },
  { q: "Is this for beginners?", a: "Yes. The system adapts to your level — beginners get guided routines and AI form coaching, advanced lifters get progressive overload analytics and PR tracking." },
  { q: "Can I track macros?", a: "Yes. Calories, protein, carbs, fat, and water. Premium adds the AI food scan — snap a meal and get full macro breakdowns instantly." },
  { q: "Does the app have community features?", a: "The Arena is a real, premium community. Post wins, ask questions, flex transformations, and compete for XP. Approved creators host drops and challenges directly inside it." },
  { q: "When does it launch?", a: "We're in private beta now. Join the waitlist to lock in early access — first wave drops to early signups before public release." },
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
