import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send, Loader2, Users, Trophy, UserCheck, Globe2, Bold, Italic, Heading1,
  Heading2, List, Link2, Image as ImageIcon, MousePointerClick, X, Eye, Code2,
  ChevronRight, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { sendAnnouncement, fetchRecipientCounts } from "../lib/api";

const GROUPS = [
  { id: "waitlist", label: "Waitlist", icon: Users, accent: "purple", desc: "Everyone who joined the waitlist" },
  { id: "creator_applicants", label: "Creator Applicants", icon: Trophy, accent: "amber", desc: "All creator applications (any status)" },
  { id: "approved_creators", label: "Approved Creators", icon: UserCheck, accent: "green", desc: "Only approved creators" },
  { id: "everyone", label: "Everyone", icon: Globe2, accent: "cyan", desc: "Waitlist + creator applicants (deduped)" },
];

const accentMap = {
  purple: "border-purple-500/40 bg-purple-500/8 text-purple-200 hover:border-purple-500/60",
  amber: "border-amber-500/40 bg-amber-500/8 text-amber-200 hover:border-amber-500/60",
  green: "border-emerald-500/40 bg-emerald-500/8 text-emerald-200 hover:border-emerald-500/60",
  cyan: "border-cyan-500/40 bg-cyan-500/8 text-cyan-200 hover:border-cyan-500/60",
};
const accentActive = {
  purple: "border-purple-500/80 bg-purple-500/20 text-white glow-purple",
  amber: "border-amber-500/80 bg-amber-500/20 text-white glow-amber",
  green: "border-emerald-500/80 bg-emerald-500/20 text-white glow-green",
  cyan: "border-cyan-500/80 bg-cyan-500/20 text-white glow-cyan",
};

export default function Broadcast() {
  const [group, setGroup] = useState("waitlist");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [counts, setCounts] = useState(null);
  const [sending, setSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    fetchRecipientCounts().then((res) => setCounts(res.data)).catch(() => {});
  }, []);

  const insertAtCursor = useCallback((before, after = "", placeholder = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = html.substring(start, end) || placeholder;
    const next = html.substring(0, start) + before + selected + after + html.substring(end);
    setHtml(next);
    requestAnimationFrame(() => {
      ta.focus();
      const cursor = start + before.length + selected.length + after.length;
      ta.setSelectionRange(cursor, cursor);
    });
  }, [html]);

  const tools = [
    { icon: Heading1, title: "Heading", action: () => insertAtCursor('<h2 style="color:#fff;font-size:22px;font-weight:800;margin:18px 0 10px;">', "</h2>", "Bold heading") },
    { icon: Heading2, title: "Subheading", action: () => insertAtCursor('<h3 style="color:#c4b5fd;font-size:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:14px 0 6px;">', "</h3>", "Subheading") },
    { icon: Bold, title: "Bold", action: () => insertAtCursor('<strong style="color:#fff;">', "</strong>", "bold text") },
    { icon: Italic, title: "Italic", action: () => insertAtCursor("<em>", "</em>", "italic text") },
    { icon: List, title: "Bullets", action: () => insertAtCursor('<ul style="margin:10px 0;padding-left:20px;line-height:1.7;">\n  <li>', "</li>\n  <li>second item</li>\n</ul>", "first item") },
    { icon: Link2, title: "Link", action: () => {
      const url = window.prompt("URL", "https://");
      if (!url) return;
      insertAtCursor(`<a href="${url}" style="color:#a855f7;text-decoration:underline;">`, "</a>", "link text");
    }},
    { icon: MousePointerClick, title: "CTA Button", action: () => {
      const url = window.prompt("Button URL", "https://");
      if (!url) return;
      const label = window.prompt("Button label", "Get Early Access") || "Click here";
      insertAtCursor(`<div style="text-align:center;margin:24px 0;"><a href="${url}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;text-decoration:none;font-weight:700;border-radius:999px;box-shadow:0 0 20px rgba(168,85,247,0.4);">${label}</a></div>`);
    }},
    { icon: ImageIcon, title: "Image", action: () => {
      const url = window.prompt("Image URL", "https://");
      if (!url) return;
      insertAtCursor(`<img src="${url}" alt="" style="max-width:100%;border-radius:12px;margin:14px 0;border:1px solid rgba(168,85,247,0.25);" />`);
    }},
    { icon: Code2, title: "Logo Header", action: () => insertAtCursor(`<div style="text-align:center;margin:8px 0 20px;"><div style="display:inline-block;padding:6px 14px;background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.4);border-radius:999px;color:#c4b5fd;font-size:11px;font-weight:700;letter-spacing:4px;">REVENGE ARC</div></div>`) },
  ];

  const insertSignature = () => {
    insertAtCursor(`\n<div style="margin-top:28px;padding-top:18px;border-top:1px solid rgba(168,85,247,0.18);color:#a8a8c2;font-size:14px;">— The Revenge Arc Team<br><span style="color:#7a7a96;font-size:12px;">Discipline built different.</span></div>\n`);
  };

  const groupMeta = GROUPS.find((g) => g.id === group);
  const groupCount = counts?.[group] ?? "—";
  const canSend = subject.trim() && html.trim() && (counts?.[group] ?? 0) > 0;

  const onConfirm = async () => {
    setConfirmOpen(false);
    setSending(true);
    try {
      const res = await sendAnnouncement({ subject, html_content: html, recipient_group: group });
      toast.success(`Sent to ${res.data.sent} of ${res.data.total} (failed: ${res.data.failed})`);
      setSubject("");
      setHtml("");
    } catch (err) {
      toast.error("Broadcast failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid lg:grid-cols-2 gap-6"
    >
      {/* Editor */}
      <div className="space-y-5">
        {/* Recipient selector */}
        <div className="glass rounded-2xl p-5">
          <div className="text-[10px] tracking-[0.3em] text-white/55 font-bold mb-3">RECIPIENTS</div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {GROUPS.map((g) => {
              const active = group === g.id;
              const cls = active ? accentActive[g.accent] : `${accentMap[g.accent]} bg-white/3`;
              const count = counts?.[g.id];
              return (
                <button
                  key={g.id}
                  onClick={() => setGroup(g.id)}
                  className={`text-left rounded-xl border p-3.5 transition ${cls}`}
                  data-testid={`recipient-${g.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <g.icon className="h-4 w-4" />
                      <span className="font-bold text-sm">{g.label}</span>
                    </div>
                    <span className="font-display font-extrabold text-base">{count ?? "—"}</span>
                  </div>
                  <div className="text-[11px] mt-1 opacity-75">{g.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-[10px] tracking-[0.3em] text-white/55 font-bold">SUBJECT LINE</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Revenge Arc — Early access drops tomorrow"
              className="ra-input mt-2"
              data-testid="broadcast-subject"
            />
          </div>

          {/* Toolbar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] tracking-[0.3em] text-white/55 font-bold">MESSAGE</label>
              <button onClick={insertSignature} className="text-[11px] text-purple-300 hover:text-purple-200 font-bold tracking-wider">+ SIGNATURE</button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-t-xl border border-purple-500/30 bg-[#0c0a18] border-b-0">
              {tools.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={t.action}
                  title={t.title}
                  className="h-9 w-9 rounded-lg border border-white/10 bg-white/4 hover:bg-purple-500/15 hover:border-purple-500/40 text-white/80 hover:text-white grid place-items-center transition"
                  data-testid={`toolbar-${t.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <t.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="Write your message... HTML supported. Use the toolbar above to insert formatting."
              rows={14}
              className="ra-textarea !rounded-t-none !border-t-0 font-mono !text-[13px]"
              data-testid="broadcast-body"
            />
            <div className="text-[11px] text-white/40 mt-1.5 flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3" /> The Revenge Arc dark email shell + social footer wraps your message automatically.
            </div>
          </div>

          <button
            disabled={!canSend || sending}
            onClick={() => setConfirmOpen(true)}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="broadcast-send-btn"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {sending ? "Sending..." : `Send to ${groupMeta?.label} (${groupCount})`}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Live preview */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-white/55 font-bold">
              <Eye className="h-3.5 w-3.5" /> LIVE PREVIEW
            </div>
            <div className="text-[10px] text-white/40 tracking-wider">{groupMeta?.label.toUpperCase()}</div>
          </div>
          <EmailPreview subject={subject} html={html} />
        </div>
      </div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center px-4 bg-black/70 backdrop-blur-md"
            onClick={() => setConfirmOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-3xl max-w-md w-full p-7 relative"
              data-testid="broadcast-confirm-modal"
            >
              <button
                onClick={() => setConfirmOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full border border-white/10 grid place-items-center text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 grid place-items-center">
                <AlertTriangle className="h-5 w-5 text-amber-300" />
              </div>
              <h3 className="font-display font-extrabold text-2xl mt-4">Confirm broadcast</h3>
              <p className="text-white/60 mt-2 text-sm">
                You're about to email <span className="font-bold text-white">{groupCount}</span> recipients in the
                <span className="font-bold text-white"> {groupMeta?.label}</span> group. This cannot be undone.
              </p>
              <div className="mt-5 rounded-xl border border-white/10 bg-white/4 p-3.5">
                <div className="text-[10px] tracking-[0.3em] text-white/45 font-bold">SUBJECT</div>
                <div className="text-white text-sm mt-1 truncate">{subject}</div>
              </div>
              <div className="mt-5 flex items-center gap-2.5">
                <button onClick={() => setConfirmOpen(false)} className="btn-ghost flex-1 justify-center">
                  Cancel
                </button>
                <button onClick={onConfirm} className="btn-primary flex-1 justify-center" data-testid="broadcast-confirm-btn">
                  <Send className="h-4 w-4" /> Confirm & Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EmailPreview({ subject, html }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#05050a]" data-testid="email-preview">
      {/* Mock client header */}
      <div className="px-5 py-3 border-b border-white/8 text-xs">
        <div className="text-white/40">From: <span className="text-purple-300">Revenge Arc &lt;onboarding@resend.dev&gt;</span></div>
        <div className="text-white/40 mt-0.5">Subject: <span className="text-white font-bold">{subject || "(no subject)"}</span></div>
      </div>
      {/* Email body */}
      <div className="bg-[#05050a] p-4">
        <div style={{ background: "linear-gradient(180deg,#0b0b14 0%,#0a0814 100%)", border: "1px solid rgba(168,85,247,0.25)", borderRadius: "18px", overflow: "hidden", color: "#fff" }}>
          <div style={{ padding: "22px 24px", borderBottom: "1px solid rgba(168,85,247,0.18)" }}>
            <div style={{ fontSize: "11px", letterSpacing: "5px", color: "#a855f7", textTransform: "uppercase", fontWeight: 700 }}>REVENGE ARC</div>
            <div style={{ fontSize: "20px", color: "#fff", marginTop: "4px", fontWeight: 800 }}>{subject || "Your subject appears here"}</div>
          </div>
          <div style={{ padding: "22px 24px", color: "#cfcfe5", fontSize: "14px", lineHeight: 1.7 }}>
            <p style={{ margin: 0 }}>Hey <strong style={{ color: "#fff" }}>warrior</strong>,</p>
            <div
              dangerouslySetInnerHTML={{
                __html: html || '<p style="color:#7a7a96;font-style:italic;margin-top:10px;">Your message body will render here in real-time. Use the toolbar to add headings, bold, lists, links, CTAs, and images.</p>',
              }}
            />
          </div>
          <div style={{ padding: "18px 24px", borderTop: "1px solid rgba(168,85,247,0.18)", textAlign: "center" }}>
            <div style={{ marginBottom: "12px" }}>
              <span style={{ display: "inline-block", margin: "0 4px", padding: "6px 12px", background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.35)", borderRadius: "999px", color: "#f9a8d4", fontSize: "10px", fontWeight: 700, letterSpacing: "2px" }}>INSTAGRAM</span>
              <span style={{ display: "inline-block", margin: "0 4px", padding: "6px 12px", background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.35)", borderRadius: "999px", color: "#67e8f9", fontSize: "10px", fontWeight: 700, letterSpacing: "2px" }}>TIKTOK</span>
              <span style={{ display: "inline-block", margin: "0 4px", padding: "6px 12px", background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.35)", borderRadius: "999px", color: "#c4b5fd", fontSize: "10px", fontWeight: 700, letterSpacing: "2px" }}>DISCORD</span>
            </div>
            <div style={{ color: "#7a7a96", fontSize: "11px", lineHeight: 1.6 }}>
              You're receiving this because you joined the Revenge Arc movement.<br />
              <span style={{ color: "#a855f7", fontWeight: 700, letterSpacing: "3px" }}>THEREVENGE_ARC</span> · Built for warriors.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
