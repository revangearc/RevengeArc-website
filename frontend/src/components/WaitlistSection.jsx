import { useState } from "react";
import { motion } from "motion/react";
import { Flame, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { joinWaitlist } from "../lib/api";
import { Field, Textarea, SuccessCard } from "./CreatorProgramSection";

export default function WaitlistSection() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    fitness_goal: "",
    device_type: "iPhone",
    instagram: "",
    tiktok: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await joinWaitlist(form);
      setDone(true);
      toast.success("You're on the list. Check your email.");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to join waitlist.";
      toast.error(typeof msg === "string" ? msg : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="relative py-28 sm:py-36 overflow-hidden" data-testid="section-waitlist">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="orb orb-purple w-[700px] h-[700px] -top-40 left-1/2 -translate-x-1/2 opacity-25" />
      <div className="orb orb-cyan w-[400px] h-[400px] bottom-0 -right-32 opacity-20" />

      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 mb-5">
            <Flame className="h-3.5 w-3.5 text-purple-300" />
            <span className="text-[11px] tracking-[0.3em] font-bold text-purple-200">WAITLIST IS OPEN</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Join the <span className="gradient-text">movement.</span>
          </h2>
          <p className="mt-5 text-white/65 text-lg">
            Get early access, exclusive launch announcements, and the chance to be a founding warrior.
          </p>
        </div>

        <div className="mt-12">
          {done ? (
            <SuccessCard title="You're on the list." subtitle="Confirmation sent to your inbox. We'll keep you updated on early access and launches." />
          ) : (
            <motion.form
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="glass rounded-3xl p-6 sm:p-10 space-y-5"
              data-testid="waitlist-form"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <Field required label="Full Name" name="full_name" value={form.full_name} onChange={onChange("full_name")} placeholder="Your name" />
                <Field required type="email" label="Email" name="email" value={form.email} onChange={onChange("email")} placeholder="you@email.com" />
              </div>
              <Textarea required label="What's your fitness goal?" value={form.fitness_goal} onChange={onChange("fitness_goal")} rows={3} placeholder="Cut 20 lbs, build muscle, run my first 5k..." />

              <div>
                <span className="text-[11px] tracking-[0.25em] font-bold text-white/55">DEVICE TYPE *</span>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {["iPhone", "Android"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForm({ ...form, device_type: d })}
                      className={`h-12 rounded-xl border font-bold transition ${
                        form.device_type === d
                          ? "border-purple-500/60 bg-purple-500/15 text-white glow-purple"
                          : "border-white/12 bg-white/3 text-white/70 hover:bg-white/6"
                      }`}
                      data-testid={`device-${d.toLowerCase()}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Instagram (optional)" name="instagram" value={form.instagram} onChange={onChange("instagram")} placeholder="@yourhandle" />
                <Field label="TikTok (optional)" name="tiktok" value={form.tiktok} onChange={onChange("tiktok")} placeholder="@yourhandle" />
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center" data-testid="waitlist-submit-btn">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flame className="h-4 w-4" />}
                {submitting ? "Joining..." : "Join the Waitlist"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-center text-xs text-white/40">No spam. Just early access and movement updates.</p>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
}
