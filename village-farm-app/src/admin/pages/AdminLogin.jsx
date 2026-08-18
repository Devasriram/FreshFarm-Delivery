import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "admin",
    password: "password123",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please enter Admin username and password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Set admin token and user details in localStorage
      localStorage.setItem("admin_token", "admin_session_token_village_farm");
      localStorage.setItem("token", "admin_session_token_village_farm"); // For shared API headers
      localStorage.setItem(
        "admin_user",
        JSON.stringify({
          name: "Farm Admin (Owner)",
          role: "admin",
          username: formData.username,
        })
      );
      setLoading(false);
      navigate("/admin/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 z-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-600/30">
            <ShieldCheck size={36} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-white">
          Admin Control Center
        </h1>
        <p className="text-slate-400 text-xs text-center mt-1">
          Village Fresh Farm Delivery Platform
        </p>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin Username / Email
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                name="username"
                placeholder="admin"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <span>Enter Admin Panel</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo credentials box */}
        <div className="mt-6 p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <Sparkles size={14} className="text-green-400" />
            <span>Default Admin Credentials:</span>
          </div>
          <p>
            Username: <span className="font-mono text-green-400">admin</span> | Password:{" "}
            <span className="font-mono text-green-400">password123</span>
          </p>
        </div>

        {/* Navigation links */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-400">
          <Link to="/" className="hover:text-white transition">
            ← Customer Login
          </Link>
          <Link to="/delivery/login" className="text-emerald-400 hover:underline">
            Delivery Partner Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
