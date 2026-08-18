import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Truck, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { loginDeliveryPartner } from "../../services/deliveryPortalService";
import { DeliveryAuthContext } from "../../context/DeliveryAuthContext";

function DeliveryLogin() {
  const navigate = useNavigate();
  const { login } = useContext(DeliveryAuthContext);

  const [formData, setFormData] = useState({
    login_id: "DP001",
    password: "password",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleQuickSelect = (partnerId) => {
    setFormData({
      login_id: partnerId,
      password: "password",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.login_id.trim() || !formData.password) {
      setError("Please enter your Mobile Number / Partner ID and Password.");
      return;
    }

    try {
      setLoading(true);
      const res = await loginDeliveryPartner(formData);
      login(res.access_token, res.partner);
      navigate("/delivery/dashboard");
    } catch (err) {
      console.warn("Delivery login failed:", err.response?.data?.detail || err.message);
      setError(
        err.response?.data?.detail || "Invalid login credentials. Please check your Partner ID and Password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 z-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-green-500/30">
            <Truck size={32} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-white">
          Delivery Partner Portal
        </h1>
        <p className="text-slate-400 text-sm text-center mt-1">
          Village Fresh Farm Delivery Platform
        </p>

        {/* Quick Demo Partner Selectors */}
        <div className="mt-5 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Quick Select Demo Partner:
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "DP001", name: "Aravind" },
              { id: "DP002", name: "Karthik" },
              { id: "DP003", name: "Praveen" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleQuickSelect(p.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
                  formData.login_id === p.id
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                }`}
              >
                {formData.login_id === p.id && <Check size={12} />}
                <span>{p.name} ({p.id})</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Mobile Number or Partner ID
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                name="login_id"
                placeholder="e.g. DP001 or 9876543210"
                value={formData.login_id}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-sm font-medium"
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
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700/60 flex flex-col gap-3 text-center text-xs text-slate-400">
          <p>
            Default password for registered partners: <span className="font-mono text-emerald-400 font-bold">123456</span>
          </p>
          <div className="flex justify-between items-center px-2">
            <Link to="/" className="text-slate-400 hover:text-white transition">
              ← Customer Home
            </Link>
            <Link to="/admin/dashboard" className="text-emerald-400 hover:text-emerald-300 transition">
              Admin Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryLogin;
