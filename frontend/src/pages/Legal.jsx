// Revenge Arc — Legal Center
// All policy pages for revengearc.com live in this file.
// Operated under the Revenge Arc brand. Contact: revengearchelp@gmail.com
// TODO(legal): Update legal operator name when LLC is formed.
import { Link } from "react-router-dom";
import {
  Flame, ArrowLeft, Mail, Shield, FileText, Brain, Users, CreditCard,
  Trash2, Cookie, MessageCircle, ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import { SUPPORT_EMAIL } from "../lib/mockups";

// All policies share this date until the next material revision.
const LAST_UPDATED = "May 2026";

// ============================================================================
// Layout primitives
// ============================================================================

export function LegalShell({ title, kicker, lastUpdated = LAST_UPDATED, children }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="orb orb-purple w-[500px] h-[500px] -top-40 -right-32 opacity-20" />
      <div className="orb orb-cyan w-[400px] h-[400px] -bottom-40 -left-32 opacity-15" />

      <header className="sticky top-0 z-30 bg-[#05050a]/85 backdrop-blur-xl border-b border-purple-500/15">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-700 grid place-items-center glow-purple">
              <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <div className="leading-tight">
              <div className="font-display font-extrabold tracking-tight">REVENGE ARC</div>
              <div className="text-[10px] tracking-[0.4em] text-cyan-300/80">{kicker}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/legal" className="btn-ghost !py-2 !px-3.5 !text-xs sm:!text-sm" data-testid="back-to-legal">
              <Shield className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Legal Center</span>
            </Link>
            <Link to="/" className="btn-ghost !py-2 !px-3.5 !text-xs sm:!text-sm">
              <ArrowLeft className="h-3.5 w-3.5" /> Home
            </Link>
          </div>
        </div>
      </header>

      <main className="relative max-w-3xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-[11px] tracking-[0.35em] text-purple-300 font-bold mb-3">{kicker}</div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight">{title}</h1>
          <p className="text-white/45 text-sm mt-3">Last updated: {lastUpdated}</p>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-10 glass rounded-3xl p-6 sm:p-8"
        >
          {children}
        </motion.article>

        <div className="mt-10 text-center text-sm text-white/45">
          Questions? Reach us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-purple-300 hover:text-purple-200">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </main>
    </div>
  );
}

const H = ({ children, id }) => (
  <h2 id={id} className="font-display font-extrabold text-2xl text-white mt-8 mb-3 first:mt-0 scroll-mt-24">{children}</h2>
);
const P = ({ children }) => <p className="text-white/75 leading-relaxed mb-3 text-[15px]">{children}</p>;
const Strong = ({ children }) => <strong className="text-white font-semibold">{children}</strong>;
const Ul = ({ items }) => (
  <ul className="space-y-2 mb-4">
    {items.map((it) => (
      <li key={typeof it === "string" ? it : JSON.stringify(it)} className="text-white/75 text-[15px] flex items-start gap-2.5">
        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-400 flex-shrink-0" />
        <span>{it}</span>
      </li>
    ))}
  </ul>
);
const Mailto = () => (
  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-purple-300 hover:text-purple-200">
    {SUPPORT_EMAIL}
  </a>
);

// ============================================================================
// PAGE 1 — Legal Center hub
// ============================================================================

const LEGAL_LINKS = [
  { to: "/terms", title: "Terms of Service", desc: "Rules for using Revenge Arc.", icon: FileText, accent: "purple" },
  { to: "/privacy", title: "Privacy Policy", desc: "What data we collect, how we use it, and your privacy rights.", icon: Shield, accent: "cyan" },
  { to: "/ai-health-disclaimer", title: "AI & Health Disclaimer", desc: "Important limits about AI, fitness, nutrition, and health guidance.", icon: Brain, accent: "pink" },
  { to: "/community-guidelines", title: "Community Guidelines", desc: "Rules for posts, messages, comments, and community behavior.", icon: Users, accent: "amber" },
  { to: "/subscriptions-refunds", title: "Subscription & Refund Policy", desc: "Trial, billing, cancellation, refunds, and compensation days.", icon: CreditCard, accent: "green" },
  { to: "/data-deletion", title: "Data Deletion Policy", desc: "How account deletion and privacy requests work.", icon: Trash2, accent: "purple" },
  { to: "/cookies", title: "Cookie Policy", desc: "Website analytics and cookie information.", icon: Cookie, accent: "amber" },
  { to: "/contact", title: "Contact & Support", desc: "How to reach us.", icon: MessageCircle, accent: "cyan" },
];

const accentBorder = {
  purple: "border-purple-500/25 hover:border-purple-400/55 hover:shadow-[0_0_28px_rgba(168,85,247,0.18)]",
  cyan: "border-cyan-500/25 hover:border-cyan-400/55 hover:shadow-[0_0_28px_rgba(34,211,238,0.18)]",
  pink: "border-pink-500/25 hover:border-pink-400/55 hover:shadow-[0_0_28px_rgba(236,72,153,0.18)]",
  amber: "border-amber-500/25 hover:border-amber-400/55 hover:shadow-[0_0_28px_rgba(245,158,11,0.18)]",
  green: "border-emerald-500/25 hover:border-emerald-400/55 hover:shadow-[0_0_28px_rgba(16,185,129,0.18)]",
};
const accentIcon = {
  purple: "bg-purple-500/15 text-purple-300 border-purple-500/40",
  cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40",
  pink: "bg-pink-500/15 text-pink-300 border-pink-500/40",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
};

export function LegalCenterPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" data-testid="page-legal-center">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="orb orb-purple w-[600px] h-[600px] -top-40 -right-40 opacity-25" />
      <div className="orb orb-cyan w-[500px] h-[500px] -bottom-40 -left-32 opacity-15" />

      <header className="sticky top-0 z-30 bg-[#05050a]/85 backdrop-blur-xl border-b border-purple-500/15">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-700 grid place-items-center glow-purple">
              <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <div className="leading-tight">
              <div className="font-display font-extrabold tracking-tight">REVENGE ARC</div>
              <div className="text-[10px] tracking-[0.4em] text-cyan-300/80">LEGAL CENTER</div>
            </div>
          </Link>
          <Link to="/" className="btn-ghost !py-2 !px-4 !text-sm">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 mb-5">
            <Shield className="h-3.5 w-3.5 text-purple-300" />
            <span className="text-[11px] tracking-[0.3em] font-bold text-purple-200">REVENGE ARC LEGAL CENTER</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Policies, <span className="gradient-text">plainly written.</span>
          </h1>
          <p className="text-white/65 text-base sm:text-lg mt-5 leading-relaxed">
            Welcome to the Revenge Arc Legal Center. This page gives you quick access to the policies that explain how Revenge Arc works,
            how we handle data, what rules apply to users, how subscriptions work, and how to contact us.
          </p>
          <p className="text-white/55 text-sm mt-4 leading-relaxed">
            Revenge Arc is operated under the Revenge Arc brand. For legal, privacy, or support questions, contact us at{" "}
            <Mailto />.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {LEGAL_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`glass rounded-2xl p-5 sm:p-6 border ${accentBorder[l.accent]} group transition flex flex-col`}
              data-testid={`legal-card-${l.to.slice(1)}`}
            >
              <div className={`h-11 w-11 rounded-xl border grid place-items-center ${accentIcon[l.accent]}`}>
                <l.icon className="h-5 w-5" />
              </div>
              <div className="font-display font-extrabold text-xl mt-4">{l.title}</div>
              <div className="text-white/55 text-sm mt-1.5 flex-1">{l.desc}</div>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.3em] text-purple-300 group-hover:text-purple-200">
                READ <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-14 glass rounded-2xl p-6 sm:p-7 border border-white/10"
        >
          <div className="text-[11px] tracking-[0.35em] text-purple-300 font-bold mb-2">NOTE</div>
          <p className="text-white/70 text-sm leading-relaxed">
            These policies are written to help users understand Revenge Arc. They may be updated from time to time as the app grows,
            laws change, or features are added.
          </p>
        </motion.div>

        <div className="mt-10 text-center text-sm text-white/45 flex items-center justify-center gap-1.5">
          <Mail className="h-3.5 w-3.5" /> <Mailto />
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// PAGE 2 — Terms of Service
// ============================================================================

export function TermsPage() {
  return (
    <LegalShell title="Terms of Service" kicker="LEGAL · TERMS">
      <P>
        Welcome to Revenge Arc. These Terms of Service (<Strong>“Terms”</Strong>) govern your access to and use of the Revenge Arc mobile app,
        website, services, AI features, social/community features, subscriptions, and related services.
      </P>
      <P>By using Revenge Arc, you agree to these Terms. If you do not agree, do not use the app or website.</P>

      <H>1. Who operates Revenge Arc</H>
      <P>
        Revenge Arc is operated under the Revenge Arc brand. For legal, privacy, or support questions, contact us at <Mailto />.
      </P>
      <P>If Revenge Arc later forms or operates under a legal business entity, these Terms may be updated to reflect that entity.</P>

      <H>2. Eligibility and age requirement</H>
      <P>Revenge Arc is intended for users who are 18 years old or older. You may not create an account or use Revenge Arc if you are under 18.</P>
      <P>By using Revenge Arc, you confirm that you are at least 18 years old and legally able to agree to these Terms.</P>
      <P>If we learn that an underage user has created an account, we may disable or delete that account and associated data.</P>

      <H>3. What Revenge Arc provides</H>
      <P>Revenge Arc is an AI-powered fitness and progress-tracking app. Features may include:</P>
      <Ul items={[
        "workout logging",
        "nutrition tracking",
        "AI meal/photo analysis",
        "AI food logging",
        "AI voice meal logging",
        "AI workout planning",
        "GymBuddy AI coaching",
        "Form Check AI video analysis",
        "Photo Progress AI physique/progress analysis",
        "Transformation Mode",
        "Weekly Reports",
        "social/community features",
        "messaging, posts, comments, likes, and related tools",
        "subscription-based Premium access",
      ]} />
      <P>Features may change, be added, removed, limited, or updated over time.</P>

      <H>4. No medical advice</H>
      <P>Revenge Arc does not provide medical advice, diagnosis, treatment, emergency services, or professional healthcare services.</P>
      <P>
        AI outputs, workout suggestions, nutrition estimates, body fat estimates, form feedback, progress reports, and other guidance are
        for general informational and fitness purposes only. They may be incomplete, inaccurate, or unsuitable for you.
      </P>
      <P>
        You should consult a doctor, dietitian, physical therapist, certified trainer, or other qualified professional before starting or
        changing a workout, nutrition, weight-loss, or health-related program, especially if you have a medical condition, injury, eating
        disorder, are pregnant, are under medical care, or have health concerns.
      </P>
      <P>You are responsible for your own choices, workouts, nutrition, and safety.</P>

      <H>5. AI features and accuracy</H>
      <P>Revenge Arc uses AI to provide estimates and recommendations. AI can make mistakes.</P>
      <P>You understand that:</P>
      <Ul items={[
        "calorie and macro estimates may be inaccurate",
        "body fat estimates are visual estimates only",
        "physique analysis is not medical or scientific certainty",
        "form analysis may miss risks or misinterpret movement",
        "AI workout plans may not fit every user",
        "AI coaching should not replace professional judgment",
        "results are not guaranteed",
      ]} />
      <P>Use your judgment and stop any activity that causes pain, dizziness, breathing trouble, injury, or serious discomfort.</P>

      <H>6. Accounts and security</H>
      <P>You are responsible for keeping your account login information secure.</P>
      <P>You agree not to:</P>
      <Ul items={[
        "share your account with others",
        "use another user's account",
        "impersonate another person",
        "provide false information",
        "attempt to bypass security or subscription systems",
        "abuse, exploit, or reverse engineer the app",
      ]} />
      <P>If you believe your account is compromised, contact <Mailto />.</P>

      <H>7. Subscriptions and Premium features</H>
      <P>
        Revenge Arc may offer paid Premium subscriptions through Apple App Store / Apple In-App Purchases. RevenueCat may be used to manage
        subscription entitlement status.
      </P>
      <P>Premium may include features such as:</P>
      <Ul items={[
        "FoodScan AI",
        "Type & Track",
        "VoiceTrack",
        "AI Workout Builder",
        "GymBuddy AI",
        "Form Check AI",
        "Photo Progress AI",
        "Transformation Mode",
        "Weekly Reports",
        "other current or future Premium features",
      ]} />
      <P>Plans may include:</P>
      <Ul items={["Weekly Premium", "Monthly Premium", "Yearly Premium"]} />
      <P>Prices, trial availability, features, and plan options may vary by region, platform, promotional offer, or App Store display.</P>
      <P>
        Subscriptions renew automatically unless canceled through Apple before renewal. You are responsible for managing or canceling your
        subscription through your Apple account settings.
      </P>

      <H>8. Free trials</H>
      <P>
        If a 7-day free trial is offered, the trial begins when you confirm the subscription through Apple. Unless canceled before the trial
        ends, the subscription may automatically renew and Apple may charge you according to the selected plan.
      </P>
      <P>Trial availability may depend on Apple eligibility, region, account history, and App Store rules.</P>

      <H>9. Refunds</H>
      <P>Payments and refunds for iOS subscriptions are handled by Apple. Refund requests must be submitted through Apple.</P>
      <P>Revenge Arc does not control Apple&#39;s refund decisions and does not guarantee refunds.</P>
      <P>
        If your account is suspended or terminated because you violated these Terms, Community Guidelines, or applicable law, you may lose
        access to the app or Premium features and are not guaranteed a refund.
      </P>

      <H>10. Compensation days for service issues</H>
      <P>
        If Revenge Arc experiences an app-side outage, Premium feature failure, or service issue caused by Revenge Arc, we may choose to
        provide affected users with extra Premium access days or app-access credit.
      </P>
      <P>Compensation days:</P>
      <Ul items={[
        "are not guaranteed",
        "are offered at Revenge Arc's discretion",
        "do not guarantee a cash refund",
        "do not directly extend your Apple subscription",
        "may appear as internal app access through Revenge Arc systems",
      ]} />

      <H>11. User content</H>
      <P>
        You may be able to upload, post, send, or store content, including photos, videos, progress images, workout clips, messages,
        comments, captions, profile content, and other materials.
      </P>
      <P>
        You own your content. However, by uploading or posting content to Revenge Arc, you grant Revenge Arc a limited, worldwide,
        non-exclusive license to host, store, process, display, reproduce, and show that content as needed to operate the app and related
        services.
      </P>
      <P>Revenge Arc may display user content inside the app, including posts, comments, profile content, and community content.</P>
      <P>
        Revenge Arc will not use your private photos, videos, or testimonials for external marketing unless you give permission, submit the
        content for marketing, tag/submit it in a way that clearly permits marketing use, or otherwise authorize it.
      </P>
      <P>You must not upload content you do not have the right to use.</P>

      <H>12. Community conduct</H>
      <P>You agree not to post, send, upload, or engage in content or conduct involving:</P>
      <Ul items={[
        "nudity or sexual content",
        "sexual content involving minors",
        "harassment, bullying, or body shaming",
        "hate speech or discriminatory content",
        "threats or violence",
        "doxxing or sharing private information",
        "spam, scams, or fraud",
        "impersonation",
        "illegal activity",
        "selling, promoting, or facilitating drugs, steroids, controlled substances, or illegal substances",
        "unsafe fitness advice that encourages dangerous behavior",
        "copyright, trademark, or privacy violations",
        "content that violates law or platform rules",
      ]} />
      <P>We may remove content, restrict features, suspend accounts, or terminate accounts if we believe these rules are violated.</P>

      <H>13. Moderation, reporting, and appeals</H>
      <P>Users may report content or accounts through the app where available or by emailing <Mailto />.</P>
      <P>Revenge Arc may review reports and take action at its discretion.</P>
      <P>
        If your content is removed or account is restricted, you may appeal by contacting <Mailto />. We will try to review appeals within
        a reasonable time, but we do not guarantee reversal of moderation decisions.
      </P>

      <H>14. Prohibited technical behavior</H>
      <P>You may not:</P>
      <Ul items={[
        "scrape or harvest data",
        "interfere with the app or servers",
        "attempt to bypass paywalls or usage limits",
        "reverse engineer the app",
        "attack, overload, or abuse systems",
        "use bots or automation without permission",
        "exploit bugs",
        "access other users' data",
        "upload malicious code",
        "use the app for unlawful purposes",
      ]} />

      <H>15. Account suspension and termination</H>
      <P>We may suspend, restrict, or terminate your account if:</P>
      <Ul items={[
        "you violate these Terms",
        "you violate Community Guidelines",
        "you misuse AI features",
        "you harass or harm others",
        "you attempt to bypass payments or security",
        "you create safety, legal, or platform risk",
        "required by law or platform rules",
      ]} />
      <P>
        If your account is terminated for violating rules, you may lose access to your account, content, and Premium features. Refunds are
        not guaranteed and may be handled by Apple depending on the purchase.
      </P>

      <H>16. Account deletion</H>
      <P>
        You may request account deletion through the app where available. After deletion is requested, your account may be disabled
        immediately or as soon as technically possible. Revenge Arc will delete account data within 30 days, unless limited information
        must be retained for legal, billing, security, fraud prevention, dispute, abuse-prevention, or compliance reasons.
      </P>
      <P>You may also contact <Mailto /> for account or data deletion requests.</P>

      <H>17. Intellectual property</H>
      <P>
        Revenge Arc, including its name, logo, design, features, software, graphics, branding, and content, is owned by or licensed to
        Revenge Arc. You may not copy, modify, distribute, sell, or misuse Revenge Arc intellectual property without permission.
      </P>

      <H>18. No guaranteed results</H>
      <P>Revenge Arc does not guarantee:</P>
      <Ul items={[
        "weight loss",
        "muscle gain",
        "fat loss",
        "health improvement",
        "injury prevention",
        "transformation results",
        "accuracy of AI outputs",
        "uninterrupted service",
        "specific fitness or nutrition outcomes",
      ]} />
      <P>Your results depend on many factors outside Revenge Arc&#39;s control.</P>

      <H>19. Service availability</H>
      <P>Revenge Arc may be interrupted, unavailable, delayed, or changed from time to time. We may update, suspend, remove, or modify features at any time.</P>
      <P>
        We are not responsible for losses caused by temporary downtime, maintenance, third-party outages, device issues, internet problems,
        or platform changes, except where applicable law says otherwise.
      </P>

      <H>20. Third-party services</H>
      <P>
        Revenge Arc may rely on third-party providers such as Firebase, OpenAI or AI providers, RevenueCat, Apple, Google, Resend, Google
        Analytics, and other service providers.
      </P>
      <P>Your use of certain features may also be subject to third-party terms and privacy practices.</P>

      <H>21. Limitation of liability</H>
      <P>
        To the maximum extent allowed by law, Revenge Arc is not liable for indirect, incidental, special, consequential, punitive, or
        exemplary damages, including lost profits, lost data, injury, loss of goodwill, or service interruption.
      </P>
      <P>You use Revenge Arc at your own risk.</P>
      <P>Some jurisdictions do not allow certain limitations, so some limits may not apply to you.</P>

      <H>22. Indemnity</H>
      <P>You agree to defend and hold harmless Revenge Arc from claims, damages, losses, liabilities, costs, or expenses arising from:</P>
      <Ul items={[
        "your use of the app",
        "your content",
        "your violation of these Terms",
        "your violation of another person's rights",
        "your unlawful or unsafe conduct",
      ]} />

      <H>23. Governing law</H>
      <P>
        These Terms are governed by the laws of the State of New Jersey, United States, except where local consumer protection, privacy, or
        mandatory laws require otherwise.
      </P>

      <H>24. Dispute resolution</H>
      <P>Before bringing a formal claim, you agree to contact us at <Mailto /> and try to resolve the issue informally.</P>
      <P>Revenge Arc will try to resolve disputes within 30 to 60 days depending on complexity.</P>
      <P>
        If the issue cannot be resolved informally, disputes may be handled in courts located in New Jersey, United States, unless
        applicable law requires a different forum or gives you other rights.
      </P>

      <H>25. Changes to these Terms</H>
      <P>
        We may update these Terms from time to time. If changes are material, we may notify users through the app, website, email, or
        other reasonable method. Continued use of Revenge Arc after updates means you accept the updated Terms.
      </P>

      <H>26. Contact</H>
      <P>For questions about these Terms, contact <Mailto />.</P>
    </LegalShell>
  );
}

// ============================================================================
// PAGE 3 — Privacy Policy
// ============================================================================

export function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" kicker="LEGAL · PRIVACY">
      <P>
        This Privacy Policy explains how Revenge Arc collects, uses, stores, shares, and protects information when you use our mobile app,
        website, AI features, social/community features, subscriptions, and related services.
      </P>
      <P>By using Revenge Arc, you agree to the collection and use of information described in this Privacy Policy.</P>

      <H>1. Who we are</H>
      <P>Revenge Arc is operated under the Revenge Arc brand.</P>
      <P>Contact for privacy, data, or legal questions: <Mailto />.</P>
      <P>If Revenge Arc later operates through a legal entity, this Privacy Policy may be updated.</P>

      <H>2. Information we collect</H>
      <P>We may collect the following types of information.</P>

      <h3 className="font-display font-bold text-lg text-white/95 mt-5 mb-2">Account information</h3>
      <Ul items={[
        "name", "username", "email address", "login/authentication information",
        "Apple Sign-In or Google Sign-In information if used",
        "date of birth or age", "gender", "height", "weight", "fitness goals",
        "profile photo", "settings/preferences",
      ]} />

      <h3 className="font-display font-bold text-lg text-white/95 mt-5 mb-2">Fitness and nutrition information</h3>
      <Ul items={[
        "workout logs", "exercise history", "sets, reps, weight, time, notes",
        "nutrition logs", "food items", "calories/macros", "meal photos",
        "typed food inputs", "voice meal inputs or transcripts",
        "water/hydration tracking", "progress notes", "body/progress photos",
        "workout videos", "AI analysis results", "Transformation Mode data", "Weekly Reports",
      ]} />

      <h3 className="font-display font-bold text-lg text-white/95 mt-5 mb-2">AI feature data</h3>
      <P>When you use AI features, we may process:</P>
      <Ul items={[
        "text prompts", "meal descriptions", "food photos",
        "body/progress photos", "workout videos", "AI chat messages",
        "AI-generated outputs", "form analysis details",
        "physique/progress analysis details", "usage limits and feature usage",
      ]} />

      <h3 className="font-display font-bold text-lg text-white/95 mt-5 mb-2">Social/community data</h3>
      <P>If you use community features, we may collect:</P>
      <Ul items={[
        "posts", "captions", "comments", "likes", "messages",
        "friend/follow relationships", "reports/blocks", "moderation history",
        "profile/community content",
      ]} />

      <h3 className="font-display font-bold text-lg text-white/95 mt-5 mb-2">Subscription and purchase information</h3>
      <P>We may receive subscription status information from Apple and RevenueCat, such as:</P>
      <Ul items={[
        "product ID", "plan type", "entitlement status", "purchase status",
        "trial status", "expiration date", "renewal status",
        "cancellation or billing issue status",
      ]} />
      <P>We do not receive your full payment card details. Payments are processed by Apple.</P>

      <h3 className="font-display font-bold text-lg text-white/95 mt-5 mb-2">Website data</h3>
      <P>When you visit revengearc.com, we may collect:</P>
      <Ul items={[
        "waitlist email", "contact/support form information",
        "website analytics data", "device/browser information", "pages viewed",
        "referring URLs", "approximate location based on IP", "cookie or tracking preferences",
      ]} />
      <P>The website uses Google Analytics. Waitlist emails may be processed through Resend and stored in a database linked with Emergent.</P>

      <h3 className="font-display font-bold text-lg text-white/95 mt-5 mb-2">Device and technical data</h3>
      <Ul items={[
        "device type", "operating system", "app version", "crash/performance data",
        "IP address", "identifiers used for analytics or security",
        "push notification token",
        "logs needed for security, debugging, fraud prevention, and service operation",
      ]} />

      <H>3. How we use information</H>
      <P>We use information to:</P>
      <Ul items={[
        "create and manage accounts", "provide app features",
        "provide AI analysis and coaching", "track workouts and nutrition",
        "generate progress reports", "store photos/videos users upload",
        "operate social/community features", "process subscription status",
        "enforce usage limits", "improve safety and reliability",
        "provide customer support", "send important account/service messages",
        "send push notifications if enabled", "manage waitlists and website emails",
        "analyze website/app performance", "prevent fraud, abuse, and security issues",
        "comply with legal obligations",
      ]} />

      <H>4. AI processing</H>
      <P>
        Revenge Arc uses AI to provide features such as meal analysis, food logging, workout planning, coaching, form feedback, progress
        analysis, and weekly reports.
      </P>
      <P>AI outputs are estimates and may be wrong.</P>
      <P>Revenge Arc does not use your personal photos, videos, private messages, or AI chat content to train our own AI models.</P>
      <P>
        Your data may be processed by AI providers only to provide the requested AI features, maintain safety, support reliability, and
        operate the service. Third-party AI processing may be subject to the provider&#39;s own terms and privacy practices.
      </P>
      <P>We may use aggregated or de-identified data to improve product performance, reliability, analytics, and safety.</P>

      <H>5. Legal bases for EU/UK users</H>
      <P>If you are in the European Economic Area, United Kingdom, or another region with similar privacy laws, we may process your information based on:</P>
      <Ul items={[
        "your consent",
        "performance of a contract",
        "legitimate interests, such as security, product improvement, fraud prevention, and service operation",
        "compliance with legal obligations",
        "protection of vital interests where applicable",
      ]} />
      <P>You may have rights described below.</P>

      <H>6. How we share information</H>
      <P>We may share information with service providers that help operate Revenge Arc, including:</P>
      <Ul items={[
        "Firebase Auth, Firestore, and Storage for account/data storage",
        "AI providers such as OpenAI or other AI services for AI features",
        "RevenueCat for subscription entitlement management",
        "Apple App Store for in-app purchases, billing, refunds, and subscription management",
        "Google/Apple Sign-In providers if used",
        "Resend for email delivery",
        "Google Analytics for website analytics",
        "hosting, database, analytics, crash, security, and support providers",
        "legal, safety, or compliance advisors if needed",
      ]} />
      <P>We may also share information:</P>
      <Ul items={[
        "to comply with law",
        "to enforce our Terms",
        "to prevent fraud, abuse, or security issues",
        "to protect users or the public",
        "in connection with a business transfer, merger, acquisition, or sale of assets",
      ]} />
      <P>We do not sell personal photos, videos, private messages, or AI chats.</P>

      <H>7. Firebase and storage</H>
      <P>Revenge Arc may store user data in Firebase services, including Firebase Auth, Firestore, and Firebase Storage.</P>
      <P>Photos, videos, workout data, nutrition data, AI reports, and account data may be stored in Firebase or related cloud storage systems.</P>

      <H>8. International transfers</H>
      <P>
        If you use Revenge Arc outside the United States, your information may be processed or stored in the United States or other
        countries where Revenge Arc or its service providers operate.
      </P>
      <P>Privacy laws in those countries may differ from those in your country. We take steps intended to protect your information according to this Privacy Policy and applicable law.</P>

      <H>9. Data retention</H>
      <P>We keep information as long as reasonably necessary to:</P>
      <Ul items={[
        "provide the app and website", "maintain your account",
        "provide AI features", "keep subscription records", "comply with law",
        "prevent fraud/abuse", "resolve disputes", "enforce agreements",
        "maintain security",
      ]} />
      <P>
        When you request account deletion, your account may be disabled immediately or as soon as technically possible, and your account
        data is scheduled for deletion within 30 days, unless limited information must be retained for legal, billing, fraud prevention,
        security, abuse prevention, dispute, or compliance reasons.
      </P>

      <H>10. Account deletion</H>
      <P>Users can delete their account inside the app where available.</P>
      <P>After deletion is requested:</P>
      <Ul items={[
        "account access may be disabled immediately or as soon as technically possible",
        "personal data is scheduled for deletion",
        "deletion is completed within 30 days unless limited retention is legally or operationally necessary",
        "some content may remain if legally required, anonymized, already shared publicly in community areas, or needed for safety/security records",
      ]} />
      <P>You can also contact <Mailto />.</P>

      <H>11. Your privacy rights</H>
      <P>Depending on your location, you may have rights to:</P>
      <Ul items={[
        "access your data", "correct your data", "delete your data",
        "export/receive a copy of your data", "object to processing",
        "restrict processing", "withdraw consent",
        "opt out of certain analytics or marketing",
        "appeal or complain to a privacy authority",
      ]} />
      <P>To exercise privacy rights, contact <Mailto />.</P>
      <P>
        We will respond according to applicable law. General support responses are usually within 7 to 10 business days. Some privacy
        requests may take longer if complex, but we will follow applicable legal deadlines.
      </P>

      <H>12. California and U.S. state privacy rights</H>
      <P>
        Users in California or other U.S. states may have additional rights under applicable privacy laws, including rights to know,
        delete, correct, or opt out of certain uses of personal information.
      </P>
      <P>
        Revenge Arc does not knowingly sell personal information in the traditional sense. If future analytics or advertising practices
        are considered a “sale” or “sharing” under applicable laws, Revenge Arc will provide required notices and opt-out rights.
      </P>

      <H>13. Cookies and analytics</H>
      <P>The website revengearc.com uses Google Analytics and may use cookies or similar technologies to understand website usage and improve the site.</P>
      <P>Where required by law, users may be asked for cookie/analytics consent. Users can also control cookies through browser settings.</P>
      <P>See the <Link to="/cookies" className="text-purple-300 hover:text-purple-200">Cookie Policy</Link> for more details.</P>

      <H>14. Push notifications</H>
      <P>The app may collect and store push notification tokens to send reminders, progress alerts, social notifications, updates, and other app notifications.</P>
      <P>You can turn off push notifications in your device settings or in app settings where available.</P>

      <H>15. Security</H>
      <P>We use reasonable technical and organizational measures to protect information. However, no system is 100% secure. We cannot guarantee absolute security.</P>
      <P>You are responsible for keeping your login information safe.</P>

      <H>16. Children</H>
      <P>Revenge Arc is for users 18 and older. We do not knowingly collect personal information from children or users under 18.</P>
      <P>If you believe an underage person has created an account, contact <Mailto />.</P>

      <H>17. Changes to this Privacy Policy</H>
      <P>We may update this Privacy Policy from time to time. If changes are material, we may notify users through the app, website, email, or other reasonable method.</P>

      <H>18. Contact</H>
      <P>For privacy questions, data deletion, account deletion, or other requests, contact <Mailto />.</P>
    </LegalShell>
  );
}

// ============================================================================
// PAGE 4 — AI & Health Disclaimer
// ============================================================================

export function AIHealthDisclaimerPage() {
  return (
    <LegalShell title="AI & Health Disclaimer" kicker="LEGAL · DISCLAIMER">
      <P>
        Revenge Arc provides AI-powered fitness, nutrition, workout, form, and progress tools. These tools are designed to support fitness
        tracking and general wellness, but they do not replace professional medical, health, nutrition, or fitness advice.
      </P>

      <H>1. Not medical advice</H>
      <P>Revenge Arc does not provide medical advice, diagnosis, treatment, emergency services, or healthcare services.</P>
      <P>Nothing in the app should be treated as medical advice.</P>
      <P>
        If you have a medical condition, injury, eating disorder, are pregnant, are under medical care, or have health concerns, talk to a
        qualified professional before using Revenge Arc or following any workout/nutrition recommendation.
      </P>

      <H>2. AI can be wrong</H>
      <P>AI outputs may be inaccurate, incomplete, outdated, or unsuitable for your situation.</P>
      <P>This includes:</P>
      <Ul items={[
        "calorie estimates", "macro estimates", "food identification",
        "body fat estimates", "physique/progress analysis", "form feedback",
        "injury risk warnings", "workout plans", "coaching advice",
        "weekly reports", "transformation insights",
      ]} />
      <P>Use your own judgment.</P>

      <H>3. Fitness risk</H>
      <P>Exercise involves risk. You may experience injury, pain, soreness, overtraining, dizziness, breathing problems, or other issues.</P>
      <P>
        Stop exercising if you feel pain, dizziness, chest pain, breathing trouble, faintness, or any serious discomfort. Seek medical help
        if needed.
      </P>
      <P>You are responsible for your own workouts, form, intensity, equipment, environment, and safety.</P>

      <H>4. Nutrition risk</H>
      <P>Nutrition and calorie recommendations are estimates only. Revenge Arc does not provide medical nutrition therapy or treatment for eating disorders.</P>
      <P>Do not use the app to starve yourself, dangerously restrict food, overtrain, or follow unsafe nutrition practices.</P>
      <P>If you have or may have an eating disorder or medical nutrition needs, consult a qualified professional.</P>

      <H>5. Body analysis limits</H>
      <P>Photo Progress AI, body fat estimates, physique breakdowns, and potential scores are visual estimates only.</P>
      <P>They are not medical tests, genetic tests, body composition scans, or professional assessments.</P>
      <P>Lighting, angle, pose, camera quality, clothing, hydration, pump, and image quality can affect results.</P>

      <H>6. Form Check AI limits</H>
      <P>Form Check AI analyzes uploaded workout clips, but it can miss risks or misread movement.</P>
      <P>It does not replace an in-person coach, trainer, physical therapist, or medical professional.</P>
      <P>Always use safe equipment, proper technique, spotters when needed, and appropriate weight.</P>

      <H>7. No guaranteed results</H>
      <P>Revenge Arc does not guarantee:</P>
      <Ul items={[
        "weight loss", "fat loss", "muscle gain", "health improvement",
        "injury prevention", "transformation results", "accurate AI results",
        "specific performance outcomes",
      ]} />
      <P>Your results depend on many factors outside Revenge Arc&#39;s control.</P>

      <H>8. Emergency situations</H>
      <P>Do not use Revenge Arc for emergencies. If you are experiencing a medical emergency, call emergency services immediately.</P>

      <H>9. Contact</H>
      <P>Questions about this disclaimer can be sent to <Mailto />.</P>
    </LegalShell>
  );
}

// ============================================================================
// PAGE 5 — Community Guidelines
// ============================================================================

export function CommunityGuidelinesPage() {
  return (
    <LegalShell title="Community Guidelines" kicker="LEGAL · COMMUNITY">
      <P>Revenge Arc is built to help users improve, stay accountable, and build confidence. Community features must be used respectfully and safely.</P>
      <P>These Community Guidelines apply to posts, comments, messages, profiles, photos, videos, usernames, captions, reactions, and any other user content.</P>

      <H>1. Be respectful</H>
      <P>Do not harass, bully, threaten, shame, or attack other users.</P>
      <P>This includes:</P>
      <Ul items={[
        "body shaming",
        "mocking someone's weight, body, progress, appearance, race, religion, gender, disability, nationality, or identity",
        "repeated unwanted messages",
        "threats",
        "targeted harassment",
        "encouraging others to harass someone",
      ]} />

      <H>2. Fitness/progress photos</H>
      <P>Fitness and progress photos may be allowed when appropriate.</P>
      <P>However, do not post:</P>
      <Ul items={[
        "nudity", "sexual content", "explicit content",
        "minors in body/progress photos",
        "content intended to sexualize someone",
        "content that exposes private body areas",
        "non-consensual photos or videos",
      ]} />

      <H>3. No minors in restricted content</H>
      <P>Do not post minors in body/progress photos, sexualized content, or unsafe fitness content.</P>
      <P>Revenge Arc is intended for users 18 and older.</P>

      <H>4. No drugs, steroids, or illegal substances</H>
      <P>Do not sell, promote, arrange, advertise, or encourage:</P>
      <Ul items={[
        "illegal drugs", "steroids", "controlled substances",
        "prescription misuse", "unsafe supplement abuse",
        "illegal performance-enhancing substances",
      ]} />
      <P>General safety discussions may be allowed only if they do not promote illegal or unsafe behavior.</P>

      <H>5. No unsafe fitness behavior</H>
      <P>Do not encourage dangerous or reckless conduct, including:</P>
      <Ul items={[
        "intentionally unsafe lifting", "extreme starvation", "self-harm",
        "dangerous dehydration", "reckless challenges",
        "ignoring serious pain/injury", "unsafe supplement/drug use",
      ]} />

      <H>6. No hate speech</H>
      <P>Do not post content attacking people based on protected traits, including race, ethnicity, nationality, religion, gender, sexual orientation, disability, or similar characteristics.</P>

      <H>7. No threats or violence</H>
      <P>Do not threaten, encourage, praise, or organize violence.</P>

      <H>8. No spam, scams, or impersonation</H>
      <P>Do not:</P>
      <Ul items={[
        "spam users", "run scams", "impersonate others",
        "pretend to represent Revenge Arc without permission",
        "post misleading promotions",
        "sell unauthorized products or services",
        "manipulate engagement",
      ]} />

      <H>9. No private information</H>
      <P>Do not post someone else&#39;s private information, such as:</P>
      <Ul items={[
        "address", "phone number", "private email",
        "financial information", "personal documents",
        "private messages without consent",
      ]} />

      <H>10. Intellectual property</H>
      <P>Only post content you own or have permission to use. Do not upload copyrighted material, logos, photos, videos, or music you do not have rights to use.</P>

      <H>11. Reporting and blocking</H>
      <P>Users may report content/accounts through the app where available or by emailing <Mailto />.</P>
      <P>Users may block other users where the app provides that feature.</P>

      <H>12. Enforcement</H>
      <P>Revenge Arc may:</P>
      <Ul items={[
        "remove content", "limit visibility", "restrict messaging",
        "suspend accounts", "terminate accounts",
        "report serious illegal activity if required",
      ]} />
      <P>If your account is terminated for violating rules, refunds are not guaranteed and subscriptions/refunds may be handled by Apple.</P>

      <H>13. Appeals</H>
      <P>If you believe moderation action was a mistake, contact <Mailto />.</P>
      <P>Include your username, the action taken, and why you believe it should be reviewed.</P>

      <H>14. Updates</H>
      <P>These guidelines may be updated as Revenge Arc grows.</P>
    </LegalShell>
  );
}

// ============================================================================
// PAGE 6 — Subscription & Refund Policy
// ============================================================================

export function SubscriptionsRefundsPage() {
  return (
    <LegalShell title="Subscription & Refund Policy" kicker="LEGAL · SUBSCRIPTIONS">
      <P>This policy explains how Revenge Arc subscriptions, trials, cancellations, refunds, and compensation days work.</P>

      <H>1. Premium subscriptions</H>
      <P>Revenge Arc may offer Premium subscriptions through Apple App Store / Apple In-App Purchases.</P>
      <P>Premium may include:</P>
      <Ul items={[
        "FoodScan AI", "Type & Track", "VoiceTrack", "AI Workout Builder",
        "GymBuddy AI", "Form Check AI", "Photo Progress AI",
        "Transformation Mode", "Weekly Reports",
        "other Premium features added later",
      ]} />

      <H>2. Plans</H>
      <P>Current planned subscription options may include:</P>
      <Ul items={[
        "Weekly Premium: $6.99/week",
        "Monthly Premium: $16.99/month",
        "Yearly Premium: $149/year",
      ]} />
      <P>Prices may vary by region, currency, tax, Apple pricing, promotions, or App Store display.</P>

      <H>3. Free trial</H>
      <P>If offered, Premium plans may include a 7-day free trial.</P>
      <P>Unless canceled before the trial ends, the subscription may automatically renew and Apple may charge the selected plan price.</P>
      <P>Trial availability may depend on Apple account eligibility and regional availability.</P>

      <H>4. Automatic renewal</H>
      <P>Subscriptions renew automatically unless canceled through Apple before the renewal date.</P>
      <P>You are responsible for managing your subscription through your Apple account settings.</P>

      <H>5. How to cancel</H>
      <P>To cancel a subscription, use Apple&#39;s subscription management settings on your device or Apple account.</P>
      <P>Deleting the Revenge Arc app does not automatically cancel your subscription.</P>

      <H>6. Refunds</H>
      <P>Refund requests for Apple purchases must be submitted through Apple.</P>
      <P>Revenge Arc does not process Apple refunds directly and does not control Apple&#39;s refund decisions.</P>

      <H>7. Account bans and refunds</H>
      <P>If your account is suspended, restricted, or terminated because you violated Revenge Arc&#39;s Terms, Community Guidelines, or applicable law, you may lose access to Premium features.</P>
      <P>Refunds are not guaranteed. Apple may handle refund decisions according to Apple policies.</P>

      <H>8. Compensation days</H>
      <P>If Revenge Arc has an app-side outage, Premium feature failure, or service issue caused by Revenge Arc, we may choose to provide affected users with extra Premium/app access days.</P>
      <P>Compensation days:</P>
      <Ul items={[
        "are not guaranteed",
        "are provided at Revenge Arc's discretion",
        "are not cash refunds",
        "do not directly extend your Apple subscription",
        "may be applied as internal app-access credit",
        "may depend on the issue, affected users, and length of outage",
      ]} />

      <H>9. Feature availability</H>
      <P>Premium features may change over time. Some features may be improved, renamed, limited, temporarily unavailable, or replaced.</P>
      <P>Revenge Arc does not guarantee uninterrupted access to every feature at all times.</P>

      <H>10. Contact</H>
      <P>For subscription support, contact <Mailto />.</P>
      <P>For Apple refund requests, use Apple&#39;s refund process.</P>
    </LegalShell>
  );
}

// ============================================================================
// PAGE 7 — Data Deletion Policy
// ============================================================================

export function DataDeletionPage() {
  return (
    <LegalShell title="Data Deletion Policy" kicker="LEGAL · DELETION">
      <P>This policy explains how users can delete their Revenge Arc account and request deletion of personal data.</P>

      <H>1. In-app account deletion</H>
      <P>Users can delete their account inside the Revenge Arc app where available.</P>
      <P>When deletion is requested:</P>
      <Ul items={[
        "account access may be disabled immediately or as soon as technically possible",
        "account data is scheduled for deletion",
        "personal data is deleted within 30 days unless limited retention is necessary",
      ]} />

      <H>2. What may be deleted</H>
      <P>Deletion may include:</P>
      <Ul items={[
        "account profile", "email/account data", "workout logs",
        "nutrition logs", "meal photos", "voice meal logs/transcripts",
        "AI chat history", "AI reports", "body/progress photos",
        "workout videos", "Form Check AI clips",
        "social posts/comments/messages", "progress history", "app settings",
        "stored Firebase data tied to the account",
      ]} />

      <H>3. Limited retention</H>
      <P>Some information may be retained if needed for:</P>
      <Ul items={[
        "legal compliance", "billing records",
        "Apple/RevenueCat subscription records",
        "fraud prevention", "abuse prevention", "dispute resolution",
        "security logs", "enforcement history", "safety investigations",
      ]} />
      <P>Where possible, retained data may be minimized, anonymized, or separated from active account use.</P>

      <H>4. Public/community content</H>
      <P>Some content may continue to appear if:</P>
      <Ul items={[
        "it was public/community content and removal is technically delayed",
        "it was shared with other users",
        "it is needed for safety, moderation, legal, or abuse-prevention purposes",
        "it has been anonymized",
      ]} />
      <P>Revenge Arc will make reasonable efforts to remove or anonymize deleted account content where required.</P>

      <H>5. Email deletion requests</H>
      <P>Users can also request deletion by emailing <Mailto />.</P>
      <P>Include:</P>
      <Ul items={[
        "account email", "username if available", "deletion request",
        "any details needed to verify the account",
      ]} />

      <H>6. Timing</H>
      <P>Revenge Arc aims to complete account data deletion within 30 days after a valid deletion request, unless applicable law allows or requires a different timeframe.</P>
      <P>Support responses are usually within 7 to 10 business days.</P>

      <H>7. Data export/access requests</H>
      <P>Users may request access to or export of their data by emailing <Mailto />.</P>
      <P>Availability may depend on identity verification, technical limits, and applicable law.</P>

      <H>8. Contact</H>
      <P>For deletion/privacy requests: <Mailto />.</P>
    </LegalShell>
  );
}

// ============================================================================
// PAGE 8 — Cookie Policy
// ============================================================================

// TODO(legal): When Google Analytics is added to the site, also add a cookie
// consent banner (Accept / Reject / Manage) and DO NOT load GA before consent
// in regions where consent is required.
export function CookiesPage() {
  return (
    <LegalShell title="Cookie Policy" kicker="LEGAL · COOKIES">
      <P>This Cookie Policy explains how revengearc.com uses cookies and similar technologies.</P>

      <H>1. What cookies are</H>
      <P>Cookies and similar technologies are small files or identifiers used by websites to remember preferences, understand usage, improve performance, and support analytics.</P>

      <H>2. How Revenge Arc uses cookies</H>
      <P>The Revenge Arc website may use cookies or similar technologies for:</P>
      <Ul items={[
        "essential website functionality", "security",
        "remembering preferences", "analytics",
        "waitlist/signup performance", "understanding website traffic",
      ]} />

      <H>3. Google Analytics</H>
      <P>revengearc.com uses Google Analytics to understand website usage, such as pages viewed, traffic sources, device/browser information, approximate region, and site performance.</P>
      <P>Google Analytics may use cookies or similar technologies.</P>

      <H>4. Waitlist and email collection</H>
      <P>If you submit your email to the waitlist, your email may be processed through Resend and stored in a database linked with Emergent.</P>

      <H>5. Consent</H>
      <P>Where required by law, Revenge Arc may ask for consent before using non-essential analytics cookies.</P>
      <P>Users may be able to accept, reject, or manage cookie preferences through a cookie banner or settings tool.</P>

      <H>6. Managing cookies</H>
      <P>You can control cookies through your browser settings. Blocking cookies may affect some website features.</P>

      <H>7. Changes</H>
      <P>We may update this Cookie Policy as website tools or analytics practices change.</P>

      <H>8. Contact</H>
      <P>Questions about cookies can be sent to <Mailto />.</P>
    </LegalShell>
  );
}

// ============================================================================
// PAGE 9 — Contact & Support
// ============================================================================

export function ContactPage() {
  return (
    <LegalShell title="Contact & Support" kicker="LEGAL · CONTACT">
      <P>Need help with Revenge Arc? Contact us at <Mailto />.</P>

      <H>Support response time</H>
      <P>Revenge Arc aims to respond to support emails within 7 to 10 business days.</P>
      <P>Complex issues, legal requests, privacy requests, billing issues, safety reports, or account investigations may take longer.</P>

      <H>What to include</H>
      <P>When contacting support, include:</P>
      <Ul items={[
        "your account email",
        "username if available",
        "device type",
        "app version if known",
        "description of the issue",
        "screenshots or screen recordings if helpful",
        "any purchase/subscription issue details if relevant",
      ]} />
      <P>Do not send passwords, private keys, payment card numbers, or sensitive information that is not needed.</P>

      <H>Privacy and deletion requests</H>
      <P>For privacy, data access, or account deletion requests, email <Mailto />.</P>

      <H>Subscription issues</H>
      <P>Subscriptions are purchased through Apple. For refunds, users must use Apple&#39;s refund process.</P>
      <P>For app access or Premium feature issues, contact <Mailto />.</P>

      <H>Safety and community reports</H>
      <P>To report harassment, unsafe content, illegal content, nudity/sexual content, body shaming, scams, impersonation, or other violations, email <Mailto />.</P>
      <P>Include screenshots, usernames, and details if available.</P>
    </LegalShell>
  );
}

// ============================================================================
// Deprecated aliases — kept so any inbound links to /refund and /support
// continue to resolve. New canonical routes are /subscriptions-refunds and /contact.
// ============================================================================

export const RefundPage = SubscriptionsRefundsPage;
export const SupportPage = ContactPage;
