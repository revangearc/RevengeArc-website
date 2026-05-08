import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send, Loader2, Users, Trophy, UserCheck, Globe2, Bold, Italic, Heading1,
  Heading2, List, Link2, Image as ImageIcon, MousePointerClick, X, Eye, Code2,
  ChevronRight, AlertTriangle, Smartphone, BookmarkPlus, FileText, Trash2, Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  sendAnnouncement, fetchRecipientCounts, fetchTemplates, createTemplate,
  updateTemplate, deleteTemplate,
} from "../lib/api";

const GROUPS = [
  { id: "waitlist", label: "Waitlist", icon: Users, accent: "purple", desc: "Everyone on the waitlist" },
  { id: "creator_applicants", label: "Creator Applicants", icon: Trophy, accent: "amber", desc: "All creator applications" },
  { id: "approved_creators", label: "Approved Creators", icon: UserCheck, accent: "green", desc: "Only approved creators" },
  { id: "iphone_users", label: "iPhone Users", icon: Smartphone, accent: "purple", desc: "Waitlist on iPhone" },
  { id: "android_users", label: "Android Users", icon: Smartphone, accent: "cyan", desc: "Waitlist on Android" },
  { id: "everyone", label: "Everyone", icon: Globe2, accent: "cyan", desc: "Waitlist + creators (deduped)" },
  { id: "custom", label: "Custom Recipients", icon: FileText, accent: "pink", desc: "Pick exact emails" },
];

const accentMap = {
  purple: "border-purple-500/40 bg-purple-500/8 text-purple-200",
  amber: "border-amber-500/40 bg-amber-500/8 text-amber-200",
  green: "border-emerald-500/40 bg-emerald-500/8 text-emerald-200",
  cyan: "border-cyan-500/40 bg-cyan-500/8 text-cyan-200",
  pink: "border-pink-500/40 bg-pink-500/8 text-pink-200",
};
const accentActive = {
  purple: "border-purple-500/80 bg-purple-500/20 text-white glow-purple",
  amber: "border-amber-500/80 bg-amber-500/20 text-white glow-amber",
  green: "border-emerald-500/80 bg-emerald-500/20 text-white glow-green",
  cyan: "border-cyan-500/80 bg-cyan-500/20 text-white glow-cyan",
  pink: "border-pink-500/80 bg-pink-500/20 text-white",
};

export default function Broadcast({ prefillRecipients = [], onPrefillUsed }) {
  const [group, setGroup] = useState(prefillRecipients.length ? "custom" : "waitlist");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [counts, setCounts] = useState(null);
  const [sending, setSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [customRecipients, setCustomRecipients] = useState(prefillRecipients);
  const [recipientInput, setRecipientInput] = useState("");
  const [templates, setTemplates] = useState([]);
  const [activeTemplateId, setActiveTemplateId] = useState(null);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    fetchRecipientCounts().then(r => setCounts(r.data)).catch(() => {});
    fetchTemplates().then(r => setTemplates(r.data)).catch(() => {});
  }, []);

  // Apply prefill on mount
  useEffect(() => {
    if (prefillRecipients.length) {
      setGroup("custom");
      setCustomRecipients(prev => Array.from(new Set([...prev, ...prefillRecipients])));
      onPrefillUsed?.();
    }
    // eslint-disable-next-line
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
      const url = window.prompt("URL", "https://"); if (!url) return;
      insertAtCursor(`<a href="${url}" style="color:#a855f7;text-decoration:underline;">`, "</a>", "link text");
    }},
    { icon: MousePointerClick, title: "CTA Button", action: () => {
      const url = window.prompt("Button URL", "https://"); if (!url) return;
      const label = window.prompt("Button label", "Get Early Access") || "Click here";
      insertAtCursor(`<div style="text-align:center;margin:24px 0;"><a href="${url}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;text-decoration:none;font-weight:700;border-radius:999px;box-shadow:0 0 20px rgba(168,85,247,0.4);">${label}</a></div>`);
    }},
    { icon: ImageIcon, title: "Image", action: () => {
      const url = window.prompt("Image URL", "https://"); if (!url) return;
      insertAtCursor(`<img src="${url}" alt="" style="max-width:100%;border-radius:12px;margin:14px 0;border:1px solid rgba(168,85,247,0.25);" />`);
    }},
    { icon: Code2, title: "Logo Header", action: () => insertAtCursor(`<div style="text-align:center;margin:8px 0 20px;"><div style="display:inline-block;padding:6px 14px;background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.4);border-radius:999px;color:#c4b5fd;font-size:11px;font-weight:700;letter-spacing:4px;">REVENGE ARC</div></div>`) },
  ];

  const insertSignature = () => {
    insertAtCursor(`\n<div style="margin-top:28px;padding-top:18px;border-top:1px solid rgba(168,85,247,0.18);color:#a8a8c2;font-size:14px;">— The Revenge Arc Team<br><span style="color:#7a7a96;font-size:12px;">Discipline built different.</span></div>\n`);
  };

  const insertSeparator = () => insertAtCursor(`<hr style="border:none;border-top:1px solid rgba(168,85,247,0.25);margin:20px 0;" />`);

  const addRecipient = (raw) => {
    const v = (raw || "").trim().toLowerCase();
    if (!v) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { toast.error("Invalid email"); return; }
    if (customRecipients.includes(v)) return;
    setCustomRecipients([...customRecipients, v]);
  };

  const onRecipientKey = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addRecipient(recipientInput);
      setRecipientInput("");
    } else if (e.key === "Backspace" && !recipientInput && customRecipients.length) {
      setCustomRecipients(customRecipients.slice(0, -1));
    }
  };

  const removeRecipient = (email) => setCustomRecipients(customRecipients.filter(e => e !== email));

  const groupMeta = GROUPS.find(g => g.id === group);
  const groupCount = group === "custom" ? customRecipients.length : counts?.[group] ?? "—";
  const canSend = subject.trim() && html.trim() && (group === "custom" ? customRecipients.length > 0 : (counts?.[group] ?? 0) > 0);

  const onConfirm = async () => {
    setConfirmOpen(false);
    setSending(true);
    try {
      const payload = { subject, html_content: html, recipient_group: group, custom_recipients: group === "custom" ? customRecipients : [] };
      const res = await sendAnnouncement(payload);
      if (res.data.sent > 0) toast.success(`Sent to ${res.data.sent} of ${res.data.total}`);
      else toast.error(`No emails delivered. ${res.data.failed} failed${res.data.failed_emails?.length ? " (e.g. " + res.data.failed_emails[0] + ")" : ""}.`);
      if (res.data.sent > 0) { setSubject(""); setHtml(""); setActiveTemplateId(null); }
    } catch (err) {
      toast.error("Broadcast failed");
    } finally { setSending(false); }
  };

  const loadTemplate = (t) => {
    setSubject(t.subject);
    setHtml(t.html_content);
    setActiveTemplateId(t.id);
    toast.success(`Template "${t.name}" loaded`);
  };

  const saveTemplate = async () => {
    if (!templateName.trim() || !subject.trim() || !html.trim()) {
      toast.error("Name, subject and message all required.");
      return;
    }
    try {
      if (activeTemplateId) {
        const res = await updateTemplate(activeTemplateId, { name: templateName, subject, html_content: html });
        setTemplates(templates.map(t => t.id === res.data.id ? res.data : t));
        toast.success("Template updated");
      } else {
        const res = await createTemplate({ name: templateName, subject, html_content: html });
        setTemplates([res.data, ...templates]);
        setActiveTemplateId(res.data.id);
        toast.success("Template saved");
      }
      setShowSaveTemplate(false);
      setTemplateName("");
    } catch (err) { toast.error("Failed to save template"); }
  };

  const removeTemplate = async (t) => {
    if (!window.confirm(`Delete template "${t.name}"?`)) return;
    try {
      await deleteTemplate(t.id);
      setTemplates(templates.filter(x => x.id !== t.id));
      if (activeTemplateId === t.id) setActiveTemplateId(null);
      toast.success("Template deleted");
    } catch { toast.error("Delete failed"); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-5 lg:gap-6">
      <div className="space-y-5">
        {/* Recipient selector */}
        <div className="glass rounded-2xl p-5">
          <div className="text-[10px] tracking-[0.3em] text-white/55 font-bold mb-3">RECIPIENTS</div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {GROUPS.map(g => {
              const active = group === g.id;
              const cls = active ? accentActive[g.accent] : `${accentMap[g.accent]} bg-white/3 hover:border-current`;
              const count = g.id === "custom" ? customRecipients.length : counts?.[g.id];
              return (
                <button key={g.id} onClick={() => setGroup(g.id)} className={`text-left rounded-xl border p-3.5 transition ${cls}`} data-testid={`recipient-${g.id}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <g.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-bold text-sm truncate">{g.label}</span>
                    </div>
                    <span className="font-display font-extrabold text-base flex-shrink-0">{count ?? "—"}</span>
                  </div>
                  <div className="text-[11px] mt-1 opacity-75">{g.desc}</div>
                </button>
              );
            })}
          </div>

          {group === "custom" && (
            <div className="mt-4">
              <div className="text-[10px] tracking-[0.3em] text-white/55 font-bold mb-2">CUSTOM EMAILS</div>
              <div className="ra-input !h-auto !min-h-11 !py-2 flex items-center gap-1.5 flex-wrap">
                {customRecipients.map(e => (
                  <span key={e} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-100 border border-purple-300 text-purple-900 text-xs font-bold">
                    {e}
                    <button onClick={() => removeRecipient(e)} className="text-purple-600 hover:text-purple-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyDown={onRecipientKey}
                  onBlur={() => { if (recipientInput.trim()) { addRecipient(recipientInput); setRecipientInput(""); } }}
                  placeholder={customRecipients.length ? "Add another..." : "warrior@email.com, then Enter"}
                  className="flex-1 min-w-[140px] outline-none border-none bg-transparent text-zinc-900 placeholder:text-zinc-500 text-sm"
                  data-testid="custom-recipient-input"
                />
              </div>
              <div className="text-[11px] text-white/40 mt-1.5">Press Enter, comma, or space to add. Backspace to remove last.</div>
            </div>
          )}
        </div>

        {/* Templates */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] tracking-[0.3em] text-white/55 font-bold">TEMPLATES</div>
            <button onClick={() => { setShowSaveTemplate(true); setTemplateName(activeTemplateId ? templates.find(t=>t.id===activeTemplateId)?.name || "" : ""); }} className="text-[11px] text-purple-300 hover:text-purple-200 font-bold tracking-wider flex items-center gap-1" data-testid="save-template-btn">
              <BookmarkPlus className="h-3.5 w-3.5" /> {activeTemplateId ? "UPDATE" : "SAVE"}
            </button>
          </div>
          {templates.length === 0 ? (
            <div className="text-xs text-white/40 italic">No saved templates yet.</div>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {templates.map(t => (
                <div key={t.id} className={`flex items-center gap-2 rounded-lg border p-2.5 ${activeTemplateId === t.id ? "border-purple-500/50 bg-purple-500/10" : "border-white/8 bg-white/3 hover:border-white/15"}`} data-testid={`template-${t.id}`}>
                  <button onClick={() => loadTemplate(t)} className="flex-1 text-left min-w-0">
                    <div className="font-bold text-sm text-white truncate">{t.name}</div>
                    <div className="text-[11px] text-white/45 truncate">{t.subject}</div>
                  </button>
                  <button onClick={() => removeTemplate(t)} className="h-7 w-7 rounded-md bg-red-500/10 border border-red-500/30 grid place-items-center text-red-400 hover:bg-red-500/20 flex-shrink-0">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subject + Body */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-[10px] tracking-[0.3em] text-white/55 font-bold">SUBJECT LINE</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Revenge Arc — Early access drops tomorrow" className="ra-input mt-2" data-testid="broadcast-subject" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <label className="text-[10px] tracking-[0.3em] text-white/55 font-bold">MESSAGE</label>
              <div className="flex items-center gap-2">
                <button onClick={insertSeparator} className="text-[11px] text-white/55 hover:text-white font-bold tracking-wider">+ DIVIDER</button>
                <button onClick={insertSignature} className="text-[11px] text-purple-300 hover:text-purple-200 font-bold tracking-wider">+ SIGNATURE</button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-t-xl border border-purple-500/30 bg-[#0c0a18] border-b-0">
              {tools.map((t, i) => (
                <button key={i} type="button" onClick={t.action} title={t.title} className="h-9 w-9 rounded-lg border border-white/10 bg-white/4 hover:bg-purple-500/15 hover:border-purple-500/40 text-white/80 hover:text-white grid place-items-center transition" data-testid={`toolbar-${t.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <t.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <textarea ref={textareaRef} value={html} onChange={(e) => setHtml(e.target.value)} placeholder="Write your message... HTML supported. Use the toolbar above to insert formatting." rows={12} className="ra-textarea !rounded-t-none !border-t-0 font-mono !text-[13px]" data-testid="broadcast-body" />
            <div className="text-[11px] text-white/40 mt-1.5 flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3" /> The Revenge Arc dark email shell + social footer wraps your message automatically.
            </div>
          </div>

          <button disabled={!canSend || sending} onClick={() => setConfirmOpen(true)} className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed" data-testid="broadcast-send-btn">
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

      {/* Save template modal */}
      <AnimatePresence>
        {showSaveTemplate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center px-4 bg-black/70 backdrop-blur-md" onClick={() => setShowSaveTemplate(false)}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="glass rounded-3xl max-w-md w-full p-7" data-testid="save-template-modal">
              <h3 className="font-display font-extrabold text-2xl">{activeTemplateId ? "Update template" : "Save as template"}</h3>
              <p className="text-white/55 text-sm mt-1">Quickly reuse this email later.</p>
              <input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Template name" className="ra-input mt-5" autoFocus data-testid="template-name-input" />
              <div className="mt-5 flex items-center gap-2.5">
                <button onClick={() => setShowSaveTemplate(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button onClick={saveTemplate} className="btn-primary flex-1 justify-center" data-testid="save-template-confirm">
                  <Check className="h-4 w-4" /> {activeTemplateId ? "Update" : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation modal */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center px-4 bg-black/70 backdrop-blur-md" onClick={() => setConfirmOpen(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass rounded-3xl max-w-md w-full p-7 relative" data-testid="broadcast-confirm-modal">
              <button onClick={() => setConfirmOpen(false)} className="absolute top-4 right-4 h-8 w-8 rounded-full border border-white/10 grid place-items-center text-white/60 hover:text-white"><X className="h-4 w-4" /></button>
              <div className="h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 grid place-items-center"><AlertTriangle className="h-5 w-5 text-amber-300" /></div>
              <h3 className="font-display font-extrabold text-2xl mt-4">Confirm broadcast</h3>
              <p className="text-white/60 mt-2 text-sm">You're about to email <span className="font-bold text-white">{groupCount}</span> recipients in the <span className="font-bold text-white">{groupMeta?.label}</span> group. This cannot be undone.</p>
              <div className="mt-5 rounded-xl border border-white/10 bg-white/4 p-3.5">
                <div className="text-[10px] tracking-[0.3em] text-white/45 font-bold">SUBJECT</div>
                <div className="text-white text-sm mt-1 truncate">{subject}</div>
              </div>
              <div className="mt-5 flex items-center gap-2.5">
                <button onClick={() => setConfirmOpen(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button onClick={onConfirm} className="btn-primary flex-1 justify-center" data-testid="broadcast-confirm-btn"><Send className="h-4 w-4" /> Confirm & Send</button>
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
      <div className="px-5 py-3 border-b border-white/8 text-xs">
        <div className="text-white/40">From: <span className="text-purple-300">Revenge Arc &lt;no-reply@revengearc.com&gt;</span></div>
        <div className="text-white/40 mt-0.5">Subject: <span className="text-white font-bold">{subject || "(no subject)"}</span></div>
      </div>
      <div className="bg-[#05050a] p-4">
        <div style={{ background: "linear-gradient(180deg,#0b0b14 0%,#0a0814 100%)", border: "1px solid rgba(168,85,247,0.25)", borderRadius: "18px", overflow: "hidden", color: "#fff" }}>
          <div style={{ padding: "22px 24px", borderBottom: "1px solid rgba(168,85,247,0.18)" }}>
            <div style={{ fontSize: "11px", letterSpacing: "5px", color: "#a855f7", textTransform: "uppercase", fontWeight: 700 }}>REVENGE ARC</div>
            <div style={{ fontSize: "20px", color: "#fff", marginTop: "4px", fontWeight: 800 }}>{subject || "Your subject appears here"}</div>
          </div>
          <div style={{ padding: "22px 24px", color: "#cfcfe5", fontSize: "14px", lineHeight: 1.7 }}>
            <p style={{ margin: 0 }}>Hey <strong style={{ color: "#fff" }}>warrior</strong>,</p>
            <div dangerouslySetInnerHTML={{ __html: html || '<p style="color:#7a7a96;font-style:italic;margin-top:10px;">Your message body will render here in real-time.</p>' }} />
          </div>
          <div style={{ padding: "18px 24px", borderTop: "1px solid rgba(168,85,247,0.18)", textAlign: "center" }}>
            <div style={{ marginBottom: "12px" }}>
              <span style={{ display: "inline-block", margin: "0 4px", padding: "6px 12px", background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.35)", borderRadius: "999px", color: "#f9a8d4", fontSize: "10px", fontWeight: 700, letterSpacing: "2px" }}>INSTAGRAM</span>
              <span style={{ display: "inline-block", margin: "0 4px", padding: "6px 12px", background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.35)", borderRadius: "999px", color: "#67e8f9", fontSize: "10px", fontWeight: 700, letterSpacing: "2px" }}>TIKTOK</span>
              <span style={{ display: "inline-block", margin: "0 4px", padding: "6px 12px", background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.35)", borderRadius: "999px", color: "#c4b5fd", fontSize: "10px", fontWeight: 700, letterSpacing: "2px" }}>DISCORD</span>
            </div>
            <div style={{ color: "#7a7a96", fontSize: "11px", lineHeight: 1.6 }}>
              You're receiving this because you joined the Revenge Arc movement.<br />
              Need help? <a href="mailto:RevengeArkHelp@gmail.com" style={{ color: "#a855f7" }}>RevengeArkHelp@gmail.com</a><br />
              <span style={{ color: "#a855f7", fontWeight: 700, letterSpacing: "3px" }}>THEREVENGE_ARC</span> · Built for warriors.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
