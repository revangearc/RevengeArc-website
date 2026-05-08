import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Flame, LogOut, Users, Trophy, Mail, BarChart3, Search, Check, X, Loader2,
  Send, Trash2, Smartphone, ChevronRight, Eye, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchStats, fetchWaitlist, fetchCreators, approveCreator, rejectCreator,
  emailCreator, sendAnnouncement, deleteWaitlist, getToken, clearToken,
} from "../lib/api";

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "waitlist", label: "Waitlist", icon: Users },
  { id: "creators", label: "Creators", icon: Trophy },
  { id: "broadcast", label: "Broadcast", icon: Mail },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [s, w, c] = await Promise.all([fetchStats(), fetchWaitlist(), fetchCreators()]);
      setStats(s.data);
      setWaitlist(w.data);
      setCreators(c.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        clearToken();
        navigate("/admin");
      } else {
        toast.error("Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!getToken()) {
      navigate("/admin");
      return;
    }
    refresh();
  }, [navigate, refresh]);

  const onLogout = () => {
    clearToken();
    navigate("/admin");
  };

  const filteredWaitlist = waitlist.filter(
    (w) => !search || w.email.includes(search.toLowerCase()) || w.full_name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredCreators = creators.filter(
    (c) => !search || c.email.includes(search.toLowerCase()) || c.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen relative" data-testid="admin-dashboard">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="orb orb-purple w-[500px] h-[500px] -top-32 -right-32 opacity-20" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[#05050a]/85 backdrop-blur-xl border-b border-purple-500/15">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-700 grid place-items-center glow-purple">
              <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <div className="leading-tight">
              <div className="font-display font-extrabold tracking-tight">REVENGE ARC</div>
              <div className="text-[10px] tracking-[0.4em] text-cyan-300/80">ADMIN CONSOLE</div>
            </div>
          </Link>
          <button onClick={onLogout} className="btn-ghost !py-2 !px-4 !text-sm" data-testid="admin-logout-btn">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold transition whitespace-nowrap ${
                tab === t.id
                  ? "bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white glow-purple"
                  : "bg-white/4 border border-white/10 text-white/65 hover:text-white hover:bg-white/8"
              }`}
              data-testid={`admin-tab-${t.id}`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
          {(tab === "waitlist" || tab === "creators") && (
            <div className="ml-auto relative w-full sm:w-72 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full h-10 pl-10 pr-3 rounded-full bg-white/4 border border-white/10 focus:border-purple-500/50 outline-none text-sm placeholder:text-white/30"
                data-testid="admin-search"
              />
            </div>
          )}
        </div>

        <div className="mt-7">
          {loading ? (
            <div className="grid place-items-center py-32">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          ) : (
            <>
              {tab === "overview" && <Overview stats={stats} />}
              {tab === "waitlist" && (
                <WaitlistTable
                  rows={filteredWaitlist}
                  onDelete={async (id) => {
                    if (!window.confirm("Remove this entry?")) return;
                    await deleteWaitlist(id);
                    toast.success("Removed");
                    refresh();
                  }}
                />
              )}
              {tab === "creators" && (
                <CreatorsList
                  rows={filteredCreators}
                  onApprove={async (id) => {
                    await approveCreator(id);
                    toast.success("Creator approved & emailed");
                    refresh();
                  }}
                  onReject={async (id) => {
                    await rejectCreator(id);
                    toast.success("Creator rejected & emailed");
                    refresh();
                  }}
                  onEmail={async (id, payload) => {
                    await emailCreator(id, payload);
                    toast.success("Email sent");
                  }}
                />
              )}
              {tab === "broadcast" && <Broadcast />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent = "purple", icon: Icon, sub }) {
  const colorMap = {
    purple: "border-purple-500/30 text-purple-300",
    cyan: "border-cyan-500/30 text-cyan-300",
    amber: "border-amber-500/30 text-amber-300",
    green: "border-emerald-500/30 text-emerald-300",
    pink: "border-pink-500/30 text-pink-300",
  };
  return (
    <div className={`glass rounded-2xl p-5 border ${colorMap[accent].split(" ")[0]}`}>
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-[0.3em] text-white/55 font-bold">{label.toUpperCase()}</div>
        {Icon && <Icon className={`h-4 w-4 ${colorMap[accent].split(" ")[1]}`} />}
      </div>
      <div className="font-display font-extrabold text-3xl sm:text-4xl mt-3 text-white">{value}</div>
      {sub && <div className="text-xs text-white/45 mt-1">{sub}</div>}
    </div>
  );
}

function Overview({ stats }) {
  if (!stats) return null;
  const max = Math.max(1, ...stats.growth_14d.map((g) => g.count));
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total Waitlist" value={stats.total_waitlist} accent="purple" icon={Users} sub={`+${stats.recent_waitlist_7d} last 7 days`} />
        <Stat label="Total Creators" value={stats.total_creators} accent="amber" icon={Trophy} sub={`+${stats.recent_creators_7d} last 7 days`} />
        <Stat label="Pending Review" value={stats.pending_creators} accent="cyan" icon={AlertCircle} />
        <Stat label="Approved" value={stats.approved_creators} accent="green" icon={Check} />
      </div>

      {/* Growth chart */}
      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-white/55 font-bold">WAITLIST GROWTH</div>
              <div className="font-display font-extrabold text-xl mt-1">Last 14 days</div>
            </div>
            <div className="text-xs text-white/40">{stats.growth_14d.reduce((a, b) => a + b.count, 0)} signups</div>
          </div>
          <div className="flex items-end gap-1 h-44">
            {stats.growth_14d.map((g, i) => {
              const h = (g.count / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-purple-600 to-fuchsia-400 relative group"
                    style={{ height: `${Math.max(2, h)}%`, boxShadow: g.count > 0 ? "0 0 14px rgba(168,85,247,0.4)" : "none" }}
                  >
                    {g.count > 0 && (
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 text-xs bg-black/85 px-2 py-1 rounded font-bold transition">
                        {g.count}
                      </div>
                    )}
                  </div>
                  <div className="text-[9px] text-white/35">{new Date(g.date).getDate()}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-[10px] tracking-[0.3em] text-white/55 font-bold">DEVICE SPLIT</div>
          <div className="font-display font-extrabold text-xl mt-1 mb-5">Waitlist users</div>
          <DevicePill label="iPhone" count={stats.device_split.iPhone} total={stats.total_waitlist} color="purple" />
          <div className="h-3" />
          <DevicePill label="Android" count={stats.device_split.Android} total={stats.total_waitlist} color="cyan" />
        </div>
      </div>
    </motion.div>
  );
}

function DevicePill({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-white/80">
          <Smartphone className={`h-4 w-4 ${color === "purple" ? "text-purple-300" : "text-cyan-300"}`} />
          {label}
        </div>
        <div className="font-bold text-white">{count} <span className="text-white/40 text-xs font-normal">({pct}%)</span></div>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full ${color === "purple" ? "bg-gradient-to-r from-purple-500 to-fuchsia-400" : "bg-gradient-to-r from-cyan-500 to-teal-300"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function WaitlistTable({ rows, onDelete }) {
  if (!rows.length) return <Empty msg="No waitlist entries yet." />;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl overflow-hidden">
      <div className="grid grid-cols-[1.4fr_1.6fr_1fr_0.8fr_0.6fr_60px] gap-3 px-5 py-3 border-b border-white/8 text-[10px] tracking-[0.3em] text-white/45 font-bold">
        <div>NAME</div><div>EMAIL</div><div>GOAL</div><div>DEVICE</div><div>SOCIAL</div><div></div>
      </div>
      <div className="divide-y divide-white/6 max-h-[60vh] overflow-y-auto">
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-[1.4fr_1.6fr_1fr_0.8fr_0.6fr_60px] gap-3 px-5 py-3.5 items-center hover:bg-white/3 text-sm">
            <div className="font-bold text-white">{r.full_name}</div>
            <div className="text-white/70 truncate">{r.email}</div>
            <div className="text-white/55 truncate">{r.fitness_goal}</div>
            <div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${r.device_type === "iPhone" ? "bg-purple-500/15 text-purple-200" : "bg-cyan-500/15 text-cyan-200"}`}>
                {r.device_type}
              </span>
            </div>
            <div className="text-xs text-white/40 truncate">{r.instagram || r.tiktok || "—"}</div>
            <button onClick={() => onDelete(r.id)} className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/30 grid place-items-center text-red-400 hover:bg-red-500/20" data-testid={`delete-waitlist-${r.id}`}>
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CreatorsList({ rows, onApprove, onReject, onEmail }) {
  const [expanded, setExpanded] = useState(null);
  if (!rows.length) return <Empty msg="No creator applications yet." />;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      {rows.map((c) => (
        <div key={c.id} className="glass rounded-2xl overflow-hidden">
          <div className="p-5 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-bold text-white">{c.full_name}</span>
                <StatusBadge status={c.status} />
              </div>
              <div className="text-sm text-white/55 mt-0.5 truncate">{c.email} · {c.phone}</div>
              <div className="mt-2 flex items-center gap-3 text-xs text-white/55 flex-wrap">
                {c.instagram && <span className="text-pink-300">IG: {c.instagram}</span>}
                {c.tiktok && <span className="text-cyan-300">TikTok: {c.tiktok}</span>}
                <span className="text-white/35">· Wants: {c.compensation_type} ({c.desired_pay})</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setExpanded(expanded === c.id ? null : c.id)} className="btn-ghost !py-2 !px-3 !text-xs">
                <Eye className="h-3.5 w-3.5" /> {expanded === c.id ? "Hide" : "View"}
              </button>
              {c.status === "pending" && (
                <>
                  <button onClick={() => onApprove(c.id)} className="h-9 px-3 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-500/25" data-testid={`approve-${c.id}`}>
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button onClick={() => onReject(c.id)} className="h-9 px-3 rounded-full bg-red-500/15 border border-red-500/40 text-red-200 font-bold text-xs flex items-center gap-1.5 hover:bg-red-500/25" data-testid={`reject-${c.id}`}>
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </>
              )}
            </div>
          </div>
          {expanded === c.id && (
            <div className="px-5 pb-5 pt-1 border-t border-white/6 space-y-4">
              <KV k="Why support Revenge Arc" v={c.why_support} />
              <KV k="Audience" v={c.audience} />
              <EmailCreator id={c.id} onSend={onEmail} />
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: "bg-amber-500/15 border-amber-500/40 text-amber-200",
    approved: "bg-emerald-500/15 border-emerald-500/40 text-emerald-200",
    rejected: "bg-red-500/15 border-red-500/40 text-red-200",
  };
  return <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold tracking-wider uppercase ${map[status] || ""}`}>{status}</span>;
}

function KV({ k, v }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.3em] text-white/45 font-bold">{k.toUpperCase()}</div>
      <div className="text-sm text-white/80 mt-1 leading-relaxed whitespace-pre-wrap">{v}</div>
    </div>
  );
}

function EmailCreator({ id, onSend }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await onSend(id, { subject, html_content: body });
      setSubject(""); setBody("");
    } finally {
      setSending(false);
    }
  };
  return (
    <form onSubmit={submit} className="rounded-xl border border-purple-500/25 bg-purple-500/5 p-4 space-y-3">
      <div className="text-[10px] tracking-[0.3em] text-purple-300 font-bold">SEND CUSTOM EMAIL</div>
      <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" required className="w-full h-10 px-3 rounded-lg bg-white/4 border border-white/10 outline-none text-sm" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="HTML allowed. <p>Hey there...</p>" required rows={4} className="w-full px-3 py-2 rounded-lg bg-white/4 border border-white/10 outline-none text-sm resize-none" />
      <button type="submit" disabled={sending} className="btn-primary !py-2 !px-4 !text-xs">
        {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        Send Email
      </button>
    </form>
  );
}

function Broadcast() {
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [sending, setSending] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!window.confirm("Send to ALL waitlist members?")) return;
    setSending(true);
    try {
      const res = await sendAnnouncement({ subject, html_content: html });
      toast.success(`Sent to ${res.data.sent} of ${res.data.total} (failed: ${res.data.failed})`);
      setSubject(""); setHtml("");
    } catch (err) {
      toast.error("Broadcast failed");
    } finally {
      setSending(false);
    }
  };
  return (
    <motion.form initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="glass rounded-2xl p-6 space-y-4 max-w-2xl">
      <div>
        <div className="text-[10px] tracking-[0.3em] text-white/55 font-bold">BROADCAST</div>
        <div className="font-display font-extrabold text-2xl mt-1">Send announcement to all waitlist members</div>
        <p className="text-sm text-white/55 mt-1">Use HTML for formatting. The Revenge Arc email shell wraps automatically.</p>
      </div>
      <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject line" required className="w-full h-11 px-4 rounded-xl bg-white/4 border border-white/10 focus:border-purple-500/50 outline-none" data-testid="broadcast-subject" />
      <textarea value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<p>The wait is over. Revenge Arc is now live...</p>" required rows={10} className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 focus:border-purple-500/50 outline-none resize-none font-mono text-sm" data-testid="broadcast-body" />
      <button type="submit" disabled={sending} className="btn-primary" data-testid="broadcast-send-btn">
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {sending ? "Sending..." : "Send to All Waitlist"}
        <ChevronRight className="h-4 w-4" />
      </button>
    </motion.form>
  );
}

function Empty({ msg }) {
  return (
    <div className="glass rounded-2xl p-12 text-center text-white/45">
      <Users className="h-10 w-10 mx-auto opacity-30" />
      <div className="mt-3 text-sm">{msg}</div>
    </div>
  );
}
