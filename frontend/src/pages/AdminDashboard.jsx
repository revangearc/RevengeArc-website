import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame, LogOut, Users, Trophy, Mail, BarChart3, Search, Check, X, Loader2,
  Trash2, Smartphone, Eye, AlertCircle, Filter, Phone, Instagram, ShieldAlert,
  CheckSquare, Square, MinusSquare, RotateCcw, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchStats, fetchWaitlist, fetchCreators, approveCreator, rejectCreator,
  deleteWaitlist, getToken, clearToken, bulkDeleteWaitlist, deleteAllWaitlist,
  bulkDeleteCreators, deleteAllCreators, setCreatorStatus,
} from "../lib/api";
import Broadcast from "../components/Broadcast";
import PortalPopover from "../components/PortalPopover";

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
  const [creatorFilter, setCreatorFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewCreator, setViewCreator] = useState(null);
  const [prefillRecipients, setPrefillRecipients] = useState([]);

  // Selection state
  const [waitlistSel, setWaitlistSel] = useState(new Set());
  const [creatorSel, setCreatorSel] = useState(new Set());

  // Delete modal state: { kind: "waitlist"|"creators", mode: "selected"|"all", ids: [] }
  const [deleteModal, setDeleteModal] = useState(null);

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

  const onConfirmDelete = async (confirmation) => {
    const m = deleteModal;
    if (!m) return;
    try {
      let res;
      if (m.kind === "waitlist") {
        res = m.mode === "all"
          ? await deleteAllWaitlist(confirmation)
          : await bulkDeleteWaitlist(m.ids, confirmation);
      } else {
        res = m.mode === "all"
          ? await deleteAllCreators(confirmation)
          : await bulkDeleteCreators(m.ids, confirmation);
      }
      toast.success(`Deleted ${res.data.deleted} ${m.kind === "waitlist" ? "waitlist entries" : "creator applications"}`);
      setDeleteModal(null);
      setWaitlistSel(new Set());
      setCreatorSel(new Set());
      refresh();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Delete failed");
    }
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
                <WaitlistTable
                  rows={filteredWaitlist}
                  selected={waitlistSel}
                  setSelected={setWaitlistSel}
                  onDeleteOne={async (id) => {
                    if (!window.confirm("Remove this entry?")) return;
                    await deleteWaitlist(id); toast.success("Removed"); refresh();
                  }}
                  onDeleteSelected={() => setDeleteModal({ kind: "waitlist", mode: "selected", ids: Array.from(waitlistSel) })}
                  onDeleteAll={() => setDeleteModal({ kind: "waitlist", mode: "all", ids: [] })}
                />
              )}
              {tab === "creators" && (
                <CreatorsList
                  rows={filteredCreators}
                  filter={creatorFilter}
                  setFilter={setCreatorFilter}
                  counts={stats}
                  onView={setViewCreator}
                  selected={creatorSel}
                  setSelected={setCreatorSel}
                  onApprove={async (id) => { await approveCreator(id); toast.success("Creator approved & emailed"); refresh(); }}
                  onReject={async (id) => { await rejectCreator(id); toast.success("Creator rejected & emailed"); refresh(); }}
                  onStatus={async (id, status) => {
                    try {
                      await setCreatorStatus(id, status);
                      toast.success(`Status set to ${status}`);
                      refresh();
                    } catch { toast.error("Status change failed"); }
                  }}
                  onSendEmail={(c) => goSendCreatorEmail(c.email)}
                  onDeleteSelected={() => setDeleteModal({ kind: "creators", mode: "selected", ids: Array.from(creatorSel) })}
                  onDeleteAll={() => setDeleteModal({ kind: "creators", mode: "all", ids: [] })}
                />
              )}
              {tab === "broadcast" && <Broadcast prefillRecipients={prefillRecipients} onPrefillUsed={() => setPrefillRecipients([])} />}
            </>
          )}
        </div>
      </div>

      <CreatorViewModal creator={viewCreator} onClose={() => setViewCreator(null)} onSendEmail={(c) => { goSendCreatorEmail(c.email); setViewCreator(null); }} />
      <DeleteConfirmModal modal={deleteModal} onCancel={() => setDeleteModal(null)} onConfirm={onConfirmDelete} />
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
  const [hover, setHover] = useState(null); // {i, x, y, point}
  if (!growth?.length) return <div className="h-44 grid place-items-center text-white/40 text-sm">No data yet</div>;
  const w = 700;
  const h = 180;
  const padX = 10;
  const stepX = (w - padX * 2) / Math.max(1, growth.length - 1);
  const yScale = (v) => h - 20 - (v / max) * (h - 30);
  const wlPath = growth.map((g, i) => `${i === 0 ? "M" : "L"} ${padX + i * stepX} ${yScale(g.waitlist)}`).join(" ");
  const crPath = growth.map((g, i) => `${i === 0 ? "M" : "L"} ${padX + i * stepX} ${yScale(g.creators)}`).join(" ");
  const wlArea = `${wlPath} L ${padX + (growth.length - 1) * stepX} ${h - 20} L ${padX} ${h - 20} Z`;

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" });
    } catch { return ""; }
  };

  const handleMove = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const xRel = ((e.clientX - rect.left) / rect.width) * w;
    let nearest = 0;
    let best = Infinity;
    growth.forEach((g, i) => {
      const x = padX + i * stepX;
      const d = Math.abs(x - xRel);
      if (d < best) { best = d; nearest = i; }
    });
    const point = growth[nearest];
    const px = padX + nearest * stepX;
    const py = yScale(Math.max(point.waitlist, point.creators));
    setHover({ i: nearest, x: (px / w) * 100, y: (py / h) * 100, point });
  };

  return (
    <div className="relative" data-testid="growth-chart">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-44 sm:h-52"
        preserveAspectRatio="none"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="wlGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((p) => (
          <line key={p} x1={padX} x2={w - padX} y1={h - 20 - p * (h - 30)} y2={h - 20 - p * (h - 30)} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
        ))}
        <motion.path d={wlArea} fill="url(#wlGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
        <motion.path d={wlPath} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} style={{ filter: "drop-shadow(0 0 8px rgba(168,85,247,0.5))" }} />
        <motion.path d={crPath} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} />
        {growth.map((g, i) => (
          <g key={g.date || g.label || `growth-${i}`}>
            <circle cx={padX + i * stepX} cy={yScale(g.waitlist)} r={hover?.i === i ? "5" : "3"} fill={hover?.i === i ? "#a855f7" : "#fff"} stroke="#a855f7" strokeWidth="2" style={{ transition: "r 0.15s" }} />
            <circle cx={padX + i * stepX} cy={yScale(g.creators)} r={hover?.i === i ? "4" : "2.5"} fill={hover?.i === i ? "#f59e0b" : "#0a0814"} stroke="#f59e0b" strokeWidth="2" style={{ transition: "r 0.15s" }} />
          </g>
        ))}
        {hover && (
          <line x1={padX + hover.i * stepX} x2={padX + hover.i * stepX} y1={10} y2={h - 20} stroke="rgba(168,85,247,0.5)" strokeWidth="1" strokeDasharray="2 3" />
        )}
      </svg>
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-10"
            style={{
              left: `calc(${hover.x}% + ${hover.x > 75 ? -180 : 12}px)`,
              top: `calc(${hover.y}% - 10px)`,
              transform: hover.y > 70 ? "translateY(-100%)" : "none",
            }}
            data-testid="chart-tooltip"
          >
            <div className="rounded-xl border border-purple-500/40 bg-[#0a0814]/95 backdrop-blur-md shadow-2xl px-3.5 py-2.5 min-w-[160px]">
              <div className="text-[10px] tracking-[0.25em] text-white/55 font-bold">{formatDate(hover.point.date) || hover.point.label}</div>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="text-xs text-white/65">Waitlist</span>
                </div>
                <span className="font-display font-extrabold text-white">{hover.point.waitlist}</span>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-white/65">Creators</span>
                </div>
                <span className="font-display font-extrabold text-white">{hover.point.creators}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-between mt-1 text-[9px] text-white/35 font-bold tracking-wider px-2">
        {growth.filter((_, i) => i % Math.ceil(growth.length / 8) === 0 || i === growth.length - 1).map((g) => (
          <span key={g.date || g.label}>{g.label}</span>
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

function SelectionBar({ allCount, selectedCount, onSelectAll, onClear, onDeleteSelected, onDeleteAll, kindLabel }) {
  const noneSelected = selectedCount === 0;
  const allSelected = allCount > 0 && selectedCount === allCount;
  const Icon = allSelected ? CheckSquare : noneSelected ? Square : MinusSquare;
  return (
    <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <button
          onClick={allSelected ? onClear : onSelectAll}
          className="h-9 px-3 rounded-full border border-white/10 bg-white/4 hover:bg-white/8 text-white/80 hover:text-white text-xs font-bold flex items-center gap-2"
          data-testid={`${kindLabel}-select-toggle`}
        >
          <Icon className="h-4 w-4" />
          {allSelected ? `Clear (${selectedCount})` : noneSelected ? "Select all" : `Selected ${selectedCount}`}
        </button>
        {selectedCount > 0 && (
          <button
            onClick={onDeleteSelected}
            className="h-9 px-3 rounded-full border border-red-500/40 bg-red-500/15 hover:bg-red-500/25 text-red-200 text-xs font-bold flex items-center gap-2"
            data-testid={`${kindLabel}-delete-selected`}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete selected ({selectedCount})
          </button>
        )}
      </div>
      <button
        onClick={onDeleteAll}
        disabled={allCount === 0}
        className="h-9 px-3 rounded-full border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        data-testid={`${kindLabel}-delete-all`}
      >
        <ShieldAlert className="h-3.5 w-3.5" /> Delete all
      </button>
    </div>
  );
}

function WaitlistTable({ rows, selected, setSelected, onDeleteOne, onDeleteSelected, onDeleteAll }) {
  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };
  const selectAll = () => setSelected(new Set(rows.map(r => r.id)));
  const clear = () => setSelected(new Set());

  return (
    <div>
      <SelectionBar
        allCount={rows.length}
        selectedCount={selected.size}
        onSelectAll={selectAll}
        onClear={clear}
        onDeleteSelected={onDeleteSelected}
        onDeleteAll={onDeleteAll}
        kindLabel="waitlist"
      />
      {!rows.length ? <Empty msg="No waitlist entries yet." /> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[24px_1.4fr_1.6fr_1fr_0.8fr_0.6fr_60px] gap-3 px-5 py-3 border-b border-white/8 text-[10px] tracking-[0.3em] text-white/45 font-bold">
            <div></div><div>NAME</div><div>EMAIL</div><div>GOAL</div><div>DEVICE</div><div>SOCIAL</div><div></div>
          </div>
          <div className="divide-y divide-white/6 max-h-[60vh] overflow-y-auto">
            {rows.map(r => (
              <div key={r.id} className="grid grid-cols-1 sm:grid-cols-[24px_1.4fr_1.6fr_1fr_0.8fr_0.6fr_60px] gap-1.5 sm:gap-3 px-5 py-3.5 items-start sm:items-center hover:bg-white/3 text-sm">
                <button onClick={() => toggle(r.id)} className="h-5 w-5 rounded border border-white/20 grid place-items-center hover:border-purple-400" data-testid={`waitlist-check-${r.id}`}>
                  {selected.has(r.id) && <Check className="h-3 w-3 text-purple-300" />}
                </button>
                <div className="font-bold text-white">{r.full_name}</div>
                <div className="text-white/70 truncate">{r.email}</div>
                <div className="text-white/55 truncate">{r.fitness_goal}</div>
                <div><span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${r.device_type === "iPhone" ? "bg-purple-500/15 text-purple-200" : "bg-cyan-500/15 text-cyan-200"}`}>{r.device_type}</span></div>
                <div className="text-xs text-white/40 truncate">{r.instagram || r.tiktok || "—"}</div>
                <button onClick={() => onDeleteOne(r.id)} className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/30 grid place-items-center text-red-400 hover:bg-red-500/20 justify-self-end" data-testid={`delete-waitlist-${r.id}`}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function CreatorsList({ rows, filter, setFilter, counts, onView, selected, setSelected, onApprove, onReject, onStatus, onSendEmail, onDeleteSelected, onDeleteAll }) {
  const FILTERS = [
    { id: "all", label: "All", count: counts?.total_creators ?? 0, color: "border-white/15 text-white/70" },
    { id: "pending", label: "Pending", count: counts?.pending_creators ?? 0, color: "border-amber-500/40 text-amber-300" },
    { id: "approved", label: "Approved", count: counts?.approved_creators ?? 0, color: "border-emerald-500/40 text-emerald-300" },
    { id: "rejected", label: "Rejected", count: counts?.rejected_creators ?? 0, color: "border-red-500/40 text-red-300" },
  ];
  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };
  const selectAll = () => setSelected(new Set(rows.map(r => r.id)));
  const clear = () => setSelected(new Set());

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

      <SelectionBar
        allCount={rows.length}
        selectedCount={selected.size}
        onSelectAll={selectAll}
        onClear={clear}
        onDeleteSelected={onDeleteSelected}
        onDeleteAll={onDeleteAll}
        kindLabel="creators"
      />

      {!rows.length ? <Empty msg="No creator applications match this filter." /> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {rows.map(c => (
            <div key={c.id} className="glass rounded-2xl p-4 sm:p-5 flex items-center gap-4 flex-wrap" data-testid={`creator-row-${c.id}`}>
              <button onClick={() => toggle(c.id)} className="h-5 w-5 rounded border border-white/20 grid place-items-center hover:border-purple-400 flex-shrink-0" data-testid={`creator-check-${c.id}`}>
                {selected.has(c.id) && <Check className="h-3 w-3 text-purple-300" />}
              </button>
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
                {c.status === "pending" ? (
                  <>
                    <button onClick={() => onApprove(c.id)} className="h-9 px-3 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-500/25" data-testid={`approve-${c.id}`}>
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button onClick={() => onReject(c.id)} className="h-9 px-3 rounded-full bg-red-500/15 border border-red-500/40 text-red-200 font-bold text-xs flex items-center gap-1.5 hover:bg-red-500/25" data-testid={`reject-${c.id}`}>
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                  </>
                ) : (
                  <StatusMenu current={c.status} onChange={(s) => onStatus(c.id, s)} id={c.id} />
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function StatusMenu({ current, onChange, id }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const opts = [
    { id: "pending", label: "Pending", color: "text-amber-200" },
    { id: "approved", label: "Approved", color: "text-emerald-200" },
    { id: "rejected", label: "Rejected", color: "text-red-200" },
  ];
  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="h-9 px-3 rounded-full bg-white/4 border border-white/15 text-white/80 font-bold text-xs flex items-center gap-1.5 hover:bg-white/8"
        data-testid={`status-menu-${id}`}
      >
        <RotateCcw className="h-3.5 w-3.5" /> Change Status <ChevronDown className="h-3 w-3" />
      </button>
      <PortalPopover
        triggerRef={btnRef}
        open={open}
        onClose={() => setOpen(false)}
        align="end"
        side="bottom"
        offset={6}
      >
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="w-44 rounded-xl border border-white/10 bg-[#0a0814]/97 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {opts.map((o) => (
            <button
              key={o.id}
              onClick={() => { onChange(o.id); setOpen(false); }}
              disabled={o.id === current}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold hover:bg-white/5 flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed ${o.color}`}
              data-testid={`status-set-${id}-${o.id}`}
            >
              {o.label}
              {o.id === current && <Check className="h-3 w-3" />}
            </button>
          ))}
        </motion.div>
      </PortalPopover>
    </>
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

function DeleteConfirmModal({ modal, onCancel, onConfirm }) {
  const [text, setText] = useState("");
  useEffect(() => { setText(""); }, [modal]);
  const targetLabel = modal?.kind === "waitlist" ? "waitlist entries" : "creator applications";
  const count = modal?.mode === "all" ? "ALL" : (modal?.ids?.length ?? 0);
  const valid = text === "DELETE";

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center px-4 py-8 bg-black/80 backdrop-blur-md"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-3xl max-w-md w-full p-7 relative border-2 border-red-500/30"
            data-testid="delete-confirm-modal"
          >
            <button onClick={onCancel} className="absolute top-4 right-4 h-8 w-8 rounded-full border border-white/10 grid place-items-center text-white/60 hover:text-white">
              <X className="h-4 w-4" />
            </button>
            <div className="h-12 w-12 rounded-2xl bg-red-500/15 border border-red-500/40 grid place-items-center">
              <ShieldAlert className="h-5 w-5 text-red-300" />
            </div>
            <h3 className="font-display font-extrabold text-2xl mt-4">
              {modal?.mode === "all" ? "Delete ALL " : `Delete ${count} `}{targetLabel}?
            </h3>
            <p className="text-white/60 mt-2 text-sm">
              This action is <span className="font-bold text-red-300">permanent and cannot be undone</span>.
              Type <span className="font-mono font-bold text-white bg-red-500/15 px-1.5 py-0.5 rounded">DELETE</span> below to confirm.
            </p>
            <input
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className="ra-input mt-5 !font-mono"
              data-testid="delete-confirm-input"
            />
            <div className="mt-5 flex items-center gap-2.5">
              <button onClick={onCancel} className="btn-ghost flex-1 justify-center" data-testid="delete-cancel">Cancel</button>
              <button
                onClick={() => onConfirm(text)}
                disabled={!valid}
                className="flex-1 justify-center h-11 px-5 rounded-full font-bold text-sm bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                data-testid="delete-confirm-btn"
              >
                <Trash2 className="h-4 w-4" /> Confirm Delete
              </button>
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
