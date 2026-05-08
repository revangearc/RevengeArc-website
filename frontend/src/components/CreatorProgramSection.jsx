import { useState } from "react";
import { motion } from "motion/react";
import { Trophy, Send, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import SectionHeader from "./SectionHeader";
import { applyCreator } from "../lib/api";

export default function CreatorProgramSection() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    instagram: "",
    tiktok: "",
    why_support: "",
    compensation_type: "",
    desired_pay: "",
    audience: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.instagram.trim() && !form.tiktok.trim()) {
      toast.error("Instagram or TikTok handle is required (at least one).");
      return;
    }
    setSubmitting(true);
    try {
      await applyCreator(form);
      setDone(true);
      toast.success("Application received. Check your inbox.");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Something went wrong.";
      toast.error(typeof msg === "string" ? msg : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="creator" className="relative py-28 sm:py-36 overflow-hidden" data-testid="section-creator">
      <div className="orb orb-amber w-[600px] h-[600px] -top-32 -left-40 opacity-25" />
      <div className="orb orb-purple w-[500px] h-[500px] -bottom-40 -right-32 opacity-25" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 mb-5">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px] tracking-[0.3em] font-bold text-amber-300">CREATOR PROGRAM</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Build with us. <br /><span className="gradient-amber">Get paid.</span>
          </h2>
          <p className="mt-5 text-white/65 text-lg leading-relaxed">
            Selected creators get early access, brand kits, paid partnerships, and direct line to our team. We hand-pick every creator. No bots. No volume.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Manual review by our team",
              "Paid partnerships & sponsored drops",
              "Brand kit + early app access",
              "Direct slack with founders",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3 text-white/75">
                <span className="mt-1 h-5 w-5 rounded-full border border-amber-500/40 bg-amber-500/10 grid place-items-center flex-shrink-0">
                  <Check className="h-3 w-3 text-amber-300" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          {done ? (
            <SuccessCard accent="amber" title="Application received." subtitle="Manually reviewed by the Revenge Arc team. Check your inbox." />
          ) : (
            <motion.form
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="glass-amber rounded-3xl p-6 sm:p-8 space-y-5"
              data-testid="creator-form"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Full Name" required name="full_name" value={form.full_name} onChange={onChange("full_name")} placeholder="Your name" />
                <Field label="Email" required type="email" name="email" value={form.email} onChange={onChange("email")} placeholder="you@brand.com" />
                <Field label="Phone Number" required name="phone" value={form.phone} onChange={onChange("phone")} placeholder="+1 ..." />
                <Field label="Instagram Handle" name="instagram" value={form.instagram} onChange={onChange("instagram")} placeholder="@yourhandle" hint="IG or TikTok required" />
                <Field label="TikTok Handle" name="tiktok" value={form.tiktok} onChange={onChange("tiktok")} placeholder="@yourhandle" />
                <Field label="Compensation Type" required name="compensation_type" value={form.compensation_type} onChange={onChange("compensation_type")} placeholder="Cash / Equity / Affiliate / etc" />
                <Field label="Desired Pay" required name="desired_pay" value={form.desired_pay} onChange={onChange("desired_pay")} placeholder="$500/post, $5k retainer..." />
              </div>

              <Textarea label="Why do you want to support Revenge Arc?" required value={form.why_support} onChange={onChange("why_support")} rows={4} />
              <Textarea label="Tell us about your audience/community" required value={form.audience} onChange={onChange("audience")} rows={4} placeholder="Followers, niche, demographics, engagement..." />

              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center !bg-gradient-to-r !from-amber-500 !to-orange-600 !border-amber-500/60" data-testid="creator-submit-btn"
                style={{ boxShadow: "0 0 30px rgba(245,158,11,0.45), inset 0 1px 0 rgba(255,255,255,0.2)" }}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                {submitting ? "Submitting..." : "Submit Application"}
                <Send className="h-4 w-4" />
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
}

export function Field({ label, hint, ...props }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.25em] font-bold text-white/55">{label.toUpperCase()}{props.required && <span className="text-amber-400"> *</span>}</span>
      <input
        {...props}
        className="mt-1.5 w-full h-11 px-4 rounded-xl bg-white/4 border border-white/10 focus:border-purple-500/60 focus:bg-white/6 outline-none text-white placeholder:text-white/30 transition"
        data-testid={`input-${props.name || props.label?.toLowerCase().replace(/\s+/g, "-")}`}
      />
      {hint && <span className="text-[10px] text-white/40 mt-1 inline-block">{hint}</span>}
    </label>
  );
}

export function Textarea({ label, value, onChange, rows = 4, placeholder = "", required = false }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.25em] font-bold text-white/55">{label.toUpperCase()}{required && <span className="text-amber-400"> *</span>}</span>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 focus:border-purple-500/60 outline-none text-white placeholder:text-white/30 transition resize-none"
        data-testid={`textarea-${label.toLowerCase().replace(/\s+/g, "-")}`}
      />
    </label>
  );
}

export function SuccessCard({ title, subtitle, accent = "purple" }) {
  const c = accent === "amber"
    ? "border-amber-500/40 bg-amber-500/8 text-amber-200"
    : "border-emerald-500/40 bg-emerald-500/8 text-emerald-200";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`rounded-3xl border ${c} p-10 text-center`}
      data-testid="success-card"
    >
      <div className="mx-auto h-16 w-16 rounded-full border border-current grid place-items-center pulse-glow">
        <Check className="h-7 w-7" />
      </div>
      <h3 className="font-display font-extrabold text-3xl text-white mt-5">{title}</h3>
      <p className="text-white/65 mt-2">{subtitle}</p>
    </motion.div>
  );
}
