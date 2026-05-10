import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send, Loader2, Users, Trophy, UserCheck, Globe2, Bold, Italic, Heading1,
  Heading2, List, Link2, Image as ImageIcon, MousePointerClick, X, Eye, Code2,
  ChevronRight, AlertTriangle, Smartphone, BookmarkPlus, FileText, Trash2, Check,
  Search, Plus, PenLine, Mail,
} from "lucide-react";
import { toast } from "sonner";
import {
  sendAnnouncement, fetchRecipientCounts, fetchTemplates, createTemplate,
  updateTemplate, deleteTemplate, fetchSignatures, createSignature, updateSignature,
  deleteSignature, searchUsers,
} from "../lib/api";
import { SUPPORT_EMAIL } from "../lib/mockups";

const GROUPS = [
  { id: "waitlist", label: "Waitlist", icon: Users, accent: "purple", desc: "Everyone on the waitlist" },
  { id: "creator_applicants", label: "Creator Applicants", icon: Trophy, accent: "amber", desc: "All creator applications" },
  { id: "approved_creators", label: "Approved Creators", icon: UserCheck, accent: "green", desc: "Only approved creators" },
  { id: "iphone_users", label: "iPhone Users", icon: Smartphone, accent: "purple", desc: "Waitlist on iPhone" },
  { id: "android_users", label: "Android Users", icon: Smartphone, accent: "cyan", desc: "Waitlist on Android" },
  { id: "everyone", label: "Everyone", icon: Globe2, accent: "cyan", desc: "Waitlist + creators (deduped)" },
  { id: "custom", label: "Custom Recipients", icon: FileText, accent: "pink", desc: "Search & pick exact users" },
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
  const [templates, setTemplates] = useState([]);
  const [activeTemplateId, setActiveTemplateId] = useState(null);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");

  // Signatures
  const [signatures, setSignatures] = useState([]);
  const [showSigModal, setShowSigModal] = useState(false);
  const [editingSig, setEditingSig] = useState(null); // {id?, name, html_content}

  const textareaRef = useRef(null);

  useEffect(() => {
    fetchRecipientCounts().then(r => setCounts(r.data)).catch(() => {});
    fetchTemplates().then(r => setTemplates(r.data)).catch(() => {});
    fetchSignatures().then(r => setSignatures(r.data)).catch(() => {});
  }, []);

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

  const insertSignature = (html_content) => {
    insertAtCursor(`\n${html_content}\n`);
  };

  const insertSeparator = () => insertAtCursor(`<hr style="border:none;border-top:1px solid rgba(168,85,247,0.25);margin:20px 0;" />`);

  const addRecipient = (email) => {
    const v = (email || "").trim().toLowerCase();
    if (!v) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { toast.error("Invalid email"); return; }
    if (customRecipients.includes(v)) return;
    setCustomRecipients([...customRecipients, v]);
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

  const saveSig = async () => {
    if (!editingSig?.name?.trim() || !editingSig?.html_content?.trim()) {
      toast.error("Name & HTML required");
      return;
    }
    try {
      if (editingSig.id) {
        const res = await updateSignature(editingSig.id, { name: editingSig.name, html_content: editingSig.html_content });
        setSignatures(signatures.map(s => s.id === res.data.id ? res.data : s));
        toast.success("Signature updated");
      } else {
        const res = await createSignature({ name: editingSig.name, html_content: editingSig.html_content });
        setSignatures([res.data, ...signatures]);
        toast.success("Signature saved");
      }
      setShowSigModal(false);
      setEditingSig(null);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Signature save failed");
    }
  };

  const removeSig = async (s) => {
    if (!window.confirm(`Delete signature "${s.name}"?`)) return;
    try {
      await deleteSignature(s.id);
      setSignatures(signatures.filter(x => x.id !== s.id));
      toast.success("Signature deleted");
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
            <CustomRecipientPicker
              recipients={customRecipients}
              onAdd={addRecipient}
              onRemove={removeRecipient}
            />
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

        {/* Signatures */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] tracking-[0.3em] text-white/55 font-bold flex items-center gap-1.5">
              <PenLine className="h-3.5 w-3.5" /> SIGNATURES
            </div>
            <button
              onClick={() => { setEditingSig({ name: "", html_content: DEFAULT_SIG_TEMPLATE }); setShowSigModal(true); }}
              className="text-[11px] text-purple-300 hover:text-purple-200 font-bold tracking-wider flex items-center gap-1"
              data-testid="new-signature-btn"
            >
              <Plus className="h-3.5 w-3.5" /> NEW
            </button>
          </div>
          {signatures.length === 0 ? (
            <div className="text-xs text-white/40 italic">No signatures saved.</div>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {signatures.map(s => (
                <div key={s.id} className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/3 p-2.5 hover:border-purple-500/40" data-testid={`signature-${s.id}`}>
                  <button onClick={() => insertSignature(s.html_content)} className="flex-1 text-left min-w-0 flex items-center gap-2" data-testid={`signature-insert-${s.id}`}>
                    <PenLine className="h-3.5 w-3.5 text-purple-300 flex-shrink-0" />
                    <span className="font-bold text-sm text-white truncate">{s.name}</span>
                  </button>
                  <button onClick={() => { setEditingSig({ id: s.id, name: s.name, html_content: s.html_content }); setShowSigModal(true); }} className="h-7 w-7 rounded-md bg-white/4 border border-white/10 grid place-items-center text-white/70 hover:text-white flex-shrink-0" data-testid={`signature-edit-${s.id}`}>
                    <PenLine className="h-3 w-3" />
                  </button>
                  <button onClick={() => removeSig(s)} className="h-7 w-7 rounded-md bg-red-500/10 border border-red-500/30 grid place-items-center text-red-400 hover:bg-red-500/20 flex-shrink-0">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="text-[11px] text-white/40 mt-2">Click a signature to insert at cursor.</div>
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

      {/* Signature edit modal */}
      <AnimatePresence>
        {showSigModal && editingSig && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center px-4 py-6 bg-black/70 backdrop-blur-md overflow-y-auto" onClick={() => setShowSigModal(false)}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="glass rounded-3xl max-w-2xl w-full p-7 my-6" data-testid="signature-modal">
              <h3 className="font-display font-extrabold text-2xl">{editingSig.id ? "Edit signature" : "New signature"}</h3>
              <p className="text-white/55 text-sm mt-1">Manage reusable sign-offs separate from full templates.</p>
              <label className="text-[10px] tracking-[0.3em] text-white/55 font-bold mt-5 block">NAME</label>
              <input
                value={editingSig.name}
                onChange={(e) => setEditingSig({ ...editingSig, name: e.target.value })}
                placeholder="e.g. Revenge Arc Original"
                className="ra-input mt-2"
                data-testid="signature-name-input"
              />
              <label className="text-[10px] tracking-[0.3em] text-white/55 font-bold mt-5 block">HTML CONTENT</label>
              <textarea
                value={editingSig.html_content}
                onChange={(e) => setEditingSig({ ...editingSig, html_content: e.target.value })}
                rows={8}
                className="ra-textarea mt-2 font-mono !text-[13px]"
                placeholder="<div>— The Revenge Arc Team</div>"
                data-testid="signature-html-input"
              />
              <div className="mt-3 rounded-xl border border-white/10 bg-[#05050a] p-4">
                <div className="text-[10px] tracking-[0.3em] text-white/45 font-bold mb-2">PREVIEW</div>
                <div className="text-white text-sm" dangerouslySetInnerHTML={{ __html: editingSig.html_content }} />
              </div>
              <div className="mt-5 flex items-center gap-2.5">
                <button onClick={() => setShowSigModal(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button onClick={saveSig} className="btn-primary flex-1 justify-center" data-testid="signature-save-btn">
                  <Check className="h-4 w-4" /> {editingSig.id ? "Update" : "Save"}
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

const DEFAULT_SIG_TEMPLATE = `<div style="margin-top:28px;padding-top:18px;border-top:1px solid rgba(168,85,247,0.18);color:#a8a8c2;font-size:14px;line-height:1.6;">
  — The Revenge Arc Team<br>
  <span style="color:#7a7a96;font-size:12px;letter-spacing:2px;">DISCIPLINE BUILT DIFFERENT.</span>
</div>`;

function CustomRecipientPicker({ recipients, onAdd, onRemove }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await searchUsers(q);
        setResults(res.data.results || []);
        setOpen(true);
        setHighlight(0);
      } catch { /* noop */ }
      finally { setLoading(false); }
    }, 220);
    return () => clearTimeout(t);
  }, [query]);

  const commit = (item) => {
    if (item?.email) {
      onAdd(item.email);
    } else if (query.includes("@")) {
      onAdd(query);
    }
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const onKey = (e) => {
    if (!open || !results.length) {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        if (query.trim()) commit(null);
      } else if (e.key === "Backspace" && !query && recipients.length) {
        onRemove(recipients[recipients.length - 1]);
      }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => Math.min(h + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); commit(results[highlight]); }
    else if (e.key === "Escape") { setOpen(false); }
  };

  return (
    <div className="mt-4">
      <div className="text-[10px] tracking-[0.3em] text-white/55 font-bold mb-2">SEARCH & ADD WARRIORS</div>

      {/* Selected chips */}
      {recipients.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {recipients.map(e => (
            <span key={e} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-100 text-xs font-bold">
              <Mail className="h-3 w-3" />
              {e}
              <button onClick={() => onRemove(e)} className="text-purple-200 hover:text-white">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 z-10" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Search by name, email, IG or TikTok handle..."
          className="ra-input !pl-10"
          data-testid="custom-recipient-input"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-purple-300" />}

        <AnimatePresence>
          {open && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute z-30 left-0 right-0 mt-1.5 rounded-xl border border-white/12 bg-[#0a0814]/97 backdrop-blur-md shadow-2xl overflow-hidden max-h-72 overflow-y-auto"
              data-testid="recipient-search-results"
            >
              {results.map((r, i) => {
                const isSelected = recipients.includes(r.email);
                return (
                  <button
                    key={r.email}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => commit(r)}
                    disabled={isSelected}
                    className={`w-full text-left px-3.5 py-2.5 border-b border-white/5 last:border-b-0 transition flex items-center gap-3 ${highlight === i ? "bg-purple-500/20" : ""} ${isSelected ? "opacity-40 cursor-not-allowed" : "hover:bg-purple-500/15"}`}
                    data-testid={`search-result-${r.email}`}
                  >
                    <div className={`h-8 w-8 rounded-full grid place-items-center flex-shrink-0 ${r.source === "creator" ? "bg-amber-500/15 border border-amber-500/40" : "bg-purple-500/15 border border-purple-500/40"}`}>
                      {r.source === "creator" ? <Trophy className="h-3.5 w-3.5 text-amber-300" /> : <Users className="h-3.5 w-3.5 text-purple-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm truncate">{r.full_name || "—"}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${r.source === "creator" ? "bg-amber-500/15 text-amber-200" : "bg-purple-500/15 text-purple-200"}`}>
                          {r.source}
                        </span>
                        {r.status && <span className="text-[9px] text-white/40 uppercase">{r.status}</span>}
                      </div>
                      <div className="text-xs text-white/55 truncate">{r.email}</div>
                      {(r.instagram || r.tiktok) && (
                        <div className="text-[10px] text-white/40 truncate">
                          {r.instagram && <span className="text-pink-300/80">IG: {r.instagram}</span>}
                          {r.instagram && r.tiktok && <span className="mx-1">·</span>}
                          {r.tiktok && <span className="text-cyan-300/80">TT: {r.tiktok}</span>}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="text-[11px] text-white/40 mt-1.5">Type 2+ chars to search waitlist & creators. Press Enter to add custom email. Backspace removes the last chip.</div>
    </div>
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
              Need help? <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "#a855f7" }}>{SUPPORT_EMAIL}</a><br />
              <span style={{ color: "#a855f7", fontWeight: 700, letterSpacing: "3px" }}>THEREVENGE_ARC</span> · Built for warriors.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
