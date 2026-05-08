import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Flame, Loader2, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { adminLogin, setToken, getToken } from "../lib/api";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) navigate("/admin/dashboard");
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLogin(password);
      setToken(res.data.token);
      toast.success("Welcome back, commander.");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error("Invalid admin password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden grid place-items-center px-5">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="orb orb-purple w-[600px] h-[600px] -top-40 -right-40 opacity-30" />
      <div className="orb orb-cyan w-[500px] h-[500px] -bottom-40 -left-32 opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md glass rounded-3xl p-8 sm:p-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-7 group">
          <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-700 grid place-items-center glow-purple">
            <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <div className="leading-tight">
            <div className="font-display font-extrabold">REVENGE ARC</div>
            <div className="text-[10px] tracking-[0.4em] text-cyan-300/80">ADMIN CONSOLE</div>
          </div>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 mb-4">
          <Lock className="h-3.5 w-3.5 text-purple-300" />
          <span className="text-[11px] tracking-[0.3em] font-bold text-purple-200">RESTRICTED</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl">Sign in</h1>
        <p className="text-white/55 text-sm mt-1.5">Enter the master password to access the console.</p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4" data-testid="admin-login-form">
          <label className="block">
            <span className="text-[11px] tracking-[0.25em] font-bold text-white/55">PASSWORD</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="mt-2 w-full h-12 px-4 rounded-xl bg-white/4 border border-white/10 focus:border-purple-500/60 outline-none text-white placeholder:text-white/30 transition"
              placeholder="••••••••"
              data-testid="admin-password-input"
            />
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center" data-testid="admin-login-btn">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {loading ? "Authenticating..." : "Enter Console"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-white/40">
          <Link to="/" className="hover:text-white transition">← Back to site</Link>
        </div>
      </motion.div>
    </div>
  );
}
