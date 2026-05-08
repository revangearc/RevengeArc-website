import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame, LogOut, Users, Trophy, Mail, BarChart3, Search, Check, X, Loader2,
  Send, Trash2, Smartphone, Eye, AlertCircle, Filter, Phone, Instagram,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchStats, fetchWaitlist, fetchCreators, approveCreator, rejectCreator,
  deleteWaitlist, getToken, clearToken,
} from "../lib/api";
import Broadcast from "../components/Broadcast";

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "waitlist", label: "Waitlist", icon: Users },
  { id: "creators", label: "Creators", icon: Trophy },
  { id: "broadcast", label: "Broadcast", icon: Mail },
];

const RANGES = [
  { id: "24h", label: "24h" },
  { id: "2d", label: "2d" },
  { id: "7d", label: "7d" },
  { id: "14d", label: "14d" },
  { id: "30d", label: "30d" },
  { id: "3mo", label: "3mo" },
  { id: "6mo", label: "6mo" },
  { id: "1y", label: "1y" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState("overview");
  const [range, setRange] = useState("14d");
  const [stats, setStats] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
  const [creators, setCreators] = useState([]);
  const [creatorFilter, setCreatorFilter] = useState("all"); // all|pending|approved|rejected
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewCreator, setViewCreator] = useState(null);
  const [prefillRecipients, setPrefillRecipients] = useState([]);

  // URL params: ?tab=broadcast&recipients=email1,email2
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("tab");
    const recipients = params.get("recipients");
    if (t && TABS.find(x => x.id === t)) setTab(t);
    if (recipients) setPrefillRecipients(recipients.split(",").map(s => s.trim()).filter(Boolean));
  }, [location.search]);

  const refresh = useCallback(async () => {
    try {
      const [s, w, c] = await Promise.all([
        fetchStats(range),
        fetchWaitlist(),
        fetchCreators(creatorFilter === "all" ? undefined : creatorFilter),
      ]);
      setStats(s.data);
      setWaitlist(w.data);
      setCreators(c.data);
    } catch (err) {
      if (err?.response?.status === 401) { clearToken(); navigate("/admin"); }
      else toast.error("Failed to load data");
    } finally { setLoading(false); }
  }, [navigate, range, creatorFilter]);

  useEffect(() => {
    if (!getToken()) { navigate("/admin"); return; }
    refresh();
  }, [navigate, refresh]);

  const onLogout = () => { clearToken(); navigate("/admin"); };

  const filteredWaitlist = waitlist.filter(w =>
    !search || w.email.includes(search.toLowerCase()) || w.full_name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredCreators = creators.filter(c =>
    !search || c.email.includes(search.toLowerCase()) || c.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const goSendCreatorEmail = (email) => {
    setPrefillRecipients([email]);
    setTab("broadcast");
    navigate(`/admin/dashboard?tab=broadcast&recipients=${encodeURIComponent(email)}`, { replace: true });
  };

  return (
    <div className="min-h-screen relative" data-testid="admin-dashboard">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="orb orb-purple w-[500px] h-[500px] -top-32 -right-32 opacity-20" />

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
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); navigate(`/admin/dashboard${t.id === "broadcast" && prefillRecipients.length ? `?tab=broadcast&recipients=${prefillRecipients.join(",")}` : ""}`, { replace: true }); }}
              className={`px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold transition whitespace-nowrap ${tab === t.id ? "bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white glow-purple" : "bg-white/4 border border-white/10 text-white/65 hover:text-white hover:bg-white/8"}`}
              data-testid={`admin-tab-${t.id}`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
          {(tab === "waitlist" || tab === "creators") && (
            <div className="ml-auto relative w-full sm:w-72 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 z-10" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email..." className="ra-input !h-10 !pl-10 !text-sm" data-testid="admin-search" />
            </div>
          )}
        </div>

        <div className="mt-7">
          {loading ? (
            <div className="grid place-items-center py-32"><Loader2 className="h-8 w-8 animate-spin text-purple-400" /></div>
          ) : (
            <>
              {tab === "overview" && <Overview stats={stats} range={range} setRange={setRange} />}
              {tab === "waitlist" && (
                <WaitlistTable rows={filteredWaitlist} onDelete={async (id) => {
                  if (!window.confirm("Remove this entry?")) return;
                  await deleteWaitlist(id); toast.success("Removed"); refresh();
                }} />
              )}
              {tab === "creators" && (
                <CreatorsList
                  rows={filteredCreators}
                  filter={creatorFilter}
                  setFilter={setCreatorFilter}
                  counts={stats}
                  onView={setViewCreator}
                  onApprove={async (id) => { await approveCreator(id); toast.success("Creator approved & emailed"); refresh(); }}
                  onReject={async (id) => { await rejectCreator(id); toast.success("Creator rejected & emailed"); refresh(); }}
                  onSendEmail={(c) => goSendCreatorEmail(c.email)}
                />
              )}
              {tab === "broadcast" && <Broadcast prefillRecipients={prefillRecipients} onPrefillUsed={() => setPrefillRecipients([])} />}
            </>
          )}
        </div>
      </div>

      <CreatorViewModal creator={viewCreator} onClose={() => setViewCreator(null)} onSendEmail={(c) => { goSendCreatorEmail(c.email); setViewCreator(null); }} />
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

function Overview({ stats, range, setRange }) {
  if (!stats) return null;
  const max = Math.max(1, ...stats.growth.map(g => g.waitlist + g.creators));
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total Waitlist" value={stats.total_waitlist} accent="purple" icon={Users} sub={`+${stats.recent_waitlist_7d} last 7 days`} />
        <Stat label="Total Creators" value={stats.total_creators} accent="amber" icon={Trophy} sub={`+${stats.recent_creators_7d} last 7 days`} />
        <Stat label="Pending Review" value={stats.pending_creators} accent="cyan" icon={AlertCircle} />
        <Stat label="Approved" value={stats.approved_creators} accent="green" icon={Check} />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-white/55 font-bold">SIGNUP GROWTH</div>
              <div className="font-display font-extrabold text-xl mt-1">Waitlist + Creators</div>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/4 border border-white/10" data-testid="range-selector">
              {RANGES.map(r => (
                <button key={r.id} onClick={() => setRange(r.id)} className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition ${range === r.id ? "bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white" : "text-white/55 hover:text-white"}`} data-testid={`range-${r.id}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <GrowthChart growth={stats.growth} max={max} />
          <div className="mt-3 flex items-center gap-4 text-xs">
            <Legend color="bg-purple-500" label="Waitlist" />
            <Legend color="bg-amber-500" label="Creators" />
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

function GrowthChart({ growth, max }) {
  if (!growth?.length) return <div className="h-44 grid place-items-center text-white/40 text-sm">No data yet</div>;
  const w = 700;
  const h = 180;
  const padX = 10;
  const stepX = (w - padX * 2) / Math.max(1, growth.length - 1);
  const yScale = (v) => h - 20 - (v / max) * (h - 30);
  const wlPath = growth.map((g, i) => `${i === 0 ? "M" : "L"} ${padX + i * stepX} ${yScale(g.waitlist)}`).join(" ");
  const crPath = growth.map((g, i) => `${i === 0 ? "M" : "L"} ${padX + i * stepX} ${yScale(g.creators)}`).join(" ");
  const wlArea = `${wlPath} L ${padX + (growth.length - 1) * stepX} ${h - 20} L ${padX} ${h - 20} Z`;

  return (
    <div className="relative" data-testid="growth-chart">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44 sm:h-52" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wlGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((p) => (
          <line key={p} x1={padX} x2={w - padX} y1={h - 20 - p * (h - 30)} y2={h - 20 - p * (h - 30)} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
        ))}
        <motion.path
          d={wlArea}
          fill="url(#wlGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d={wlPath}
          fill="none"
          stroke="#a855f7"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: "drop-shadow(0 0 8px rgba(168,85,247,0.5))" }}
        />
        <motion.path
          d={crPath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeDasharray="5 4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Dots */}
        {growth.map((g, i) => (
          <g key={i}>
            <circle cx={padX + i * stepX} cy={yScale(g.waitlist)} r="3" fill="#fff" stroke="#a855f7" strokeWidth="2">
              <title>{`${g.label}: ${g.waitlist} waitlist · ${g.creators} creators`}</title>
            </circle>
          </g>
        ))}
      </svg>
      <div className="flex justify-between mt-1 text-[9px] text-white/35 font-bold tracking-wider px-2">
        {growth.filter((_, i) => i % Math.ceil(growth.length / 8) === 0 || i === growth.length - 1).map((g, i) => (
          <span key={i}>{g.label}</span>
        ))}
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5 text-white/60">
      <span className={`h-2 w-4 rounded-sm ${color}`} /> {label}
    </div>
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
      <div className="hidden sm:grid grid-cols-[1.4fr_1.6fr_1fr_0.8fr_0.6fr_60px] gap-3 px-5 py-3 border-b border-white/8 text-[10px] tracking-[0.3em] text-white/45 font-bold">
        <div>NAME</div><div>EMAIL</div><div>GOAL</div><div>DEVICE</div><div>SOCIAL</div><div></div>
      </div>
      <div className="divide-y divide-white/6 max-h-[60vh] overflow-y-auto">
        {rows.map(r => (
          <div key={r.id} className="grid grid-cols-1 sm:grid-cols-[1.4fr_1.6fr_1fr_0.8fr_0.6fr_60px] gap-1.5 sm:gap-3 px-5 py-3.5 items-start sm:items-center hover:bg-white/3 text-sm">
            <div className="font-bold text-white">{r.full_name}</div>
            <div className="text-white/70 truncate">{r.email}</div>
            <div className="text-white/55 truncate">{r.fitness_goal}</div>
            <div><span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${r.device_type === "iPhone" ? "bg-purple-500/15 text-purple-200" : "bg-cyan-500/15 text-cyan-200"}`}>{r.device_type}</span></div>
            <div className="text-xs text-white/40 truncate">{r.instagram || r.tiktok || "—"}</div>
            <button onClick={() => onDelete(r.id)} className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/30 grid place-items-center text-red-400 hover:bg-red-500/20 justify-self-end" data-testid={`delete-waitlist-${r.id}`}>
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CreatorsList({ rows, filter, setFilter, counts, onView, onApprove, onReject, onSendEmail }) {
  const FILTERS = [
    { id: "all", label: "All", count: counts?.total_creators ?? 0, color: "border-white/15 text-white/70" },
    { id: "pending", label: "Pending", count: counts?.pending_creators ?? 0, color: "border-amber-500/40 text-amber-300" },
    { id: "approved", label: "Approved", count: counts?.approved_creators ?? 0, color: "border-emerald-500/40 text-emerald-300" },
    { id: "rejected", label: "Rejected", count: counts?.rejected_creators ?? 0, color: "border-red-500/40 text-red-300" },
  ];
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-white/50" />
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-full border text-xs font-bold transition flex items-center gap-2 ${filter === f.id ? "bg-purple-500/20 border-purple-500/60 text-white glow-purple" : `bg-white/3 ${f.color} hover:bg-white/6`}`}
            data-testid={`creator-filter-${f.id}`}
          >
            {f.label} <span className="px-1.5 py-0.5 rounded-md bg-black/30 text-[10px]">{f.count}</span>
          </button>
        ))}
      </div>

      {!rows.length ? <Empty msg="No creator applications match this filter." /> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {rows.map(c => (
            <div key={c.id} className="glass rounded-2xl p-4 sm:p-5 flex items-center gap-4 flex-wrap" data-testid={`creator-row-${c.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-bold text-white">{c.full_name}</span>
                  <StatusBadge status={c.status} />
                </div>
                <div className="text-sm text-white/55 mt-0.5 truncate">{c.email} · {c.phone}</div>
                <div className="mt-2 flex items-center gap-3 text-xs text-white/55 flex-wrap">
                  {c.instagram && <span className="text-pink-300">IG: {c.instagram}</span>}
                  {c.tiktok && <span className="text-cyan-300">TikTok: {c.tiktok}</span>}
                  <span className="text-white/35">· {c.desired_pay}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => onView(c)} className="btn-ghost !py-2 !px-3 !text-xs" data-testid={`view-${c.id}`}>
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
                <button onClick={() => onSendEmail(c)} className="btn-ghost !py-2 !px-3 !text-xs" data-testid={`email-${c.id}`}>
                  <Mail className="h-3.5 w-3.5" /> Send Email
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
          ))}
        </motion.div>
      )}
    </div>
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

function CreatorViewModal({ creator, onClose, onSendEmail }) {
  return (
    <AnimatePresence>
      {creator && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center px-4 py-8 bg-black/70 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative my-8"
            data-testid="creator-view-modal"
          >
            <button onClick={onClose} className="absolute top-4 right-4 h-9 w-9 rounded-full border border-white/10 grid place-items-center text-white/60 hover:text-white">
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4 flex-wrap">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 grid place-items-center">
                <Trophy className="h-6 w-6 text-amber-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-extrabold text-2xl">{creator.full_name}</h3>
                  <StatusBadge status={creator.status} />
                </div>
                <div className="text-sm text-white/55 mt-1">Submitted {new Date(creator.created_at).toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-3.5">
              <Field icon={Mail} label="Email" value={creator.email} />
              <Field icon={Phone} label="Phone" value={creator.phone} />
              {creator.instagram && <Field icon={Instagram} label="Instagram" value={creator.instagram} />}
              {creator.tiktok && <Field label="TikTok" value={creator.tiktok} />}
              <Field label="Desired Compensation" value={creator.desired_pay} fullCol />
            </div>

            <div className="mt-5 space-y-4">
              <Block label="Why support Revenge Arc" value={creator.why_support} />
              <Block label="Audience / Community" value={creator.audience} />
            </div>

            <div className="mt-7 flex items-center gap-2.5 flex-wrap">
              <button onClick={() => onSendEmail(creator)} className="btn-primary !py-2.5 !px-5 !text-sm" data-testid="modal-send-email">
                <Mail className="h-4 w-4" /> Send Custom Email
              </button>
              <a href={`mailto:${creator.email}`} className="btn-ghost !py-2.5 !px-5 !text-sm">
                Mail App
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ icon: Icon, label, value, fullCol }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/3 p-3.5 ${fullCol ? "sm:col-span-2" : ""}`}>
      <div className="text-[10px] tracking-[0.3em] text-white/45 font-bold flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3" />} {label.toUpperCase()}
      </div>
      <div className="text-white text-sm mt-1 break-words">{value}</div>
    </div>
  );
}

function Block({ label, value }) {
  return (
    <div className="rounded-xl border border-purple-500/25 bg-purple-500/4 p-4">
      <div className="text-[10px] tracking-[0.3em] text-purple-300 font-bold">{label.toUpperCase()}</div>
      <div className="text-sm text-white/85 mt-2 leading-relaxed whitespace-pre-wrap">{value}</div>
    </div>
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
