import { useContext, useState } from "react";
import {
  User,
  Phone,
  Mail,
  Truck,
  Shield,
  LogOut,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { DeliveryAuthContext } from "../../context/DeliveryAuthContext";
import { updateAvailabilityStatus } from "../../services/deliveryPortalService";

function DeliveryProfile() {
  const { partner, logout, updatePartnerState } = useContext(DeliveryAuthContext);
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState("");

  const handleAvailability = async (newStatus) => {
    try {
      setUpdating(true);
      await updateAvailabilityStatus(newStatus);
      updatePartnerState({ availability_status: newStatus });
      setMsg(`Availability updated to ${newStatus}`);
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Partner Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Your delivery agent account information & operational status
        </p>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{msg}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-100 pb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/20">
            {partner?.partner_name?.charAt(0) || "D"}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {partner?.partner_name}
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Active Partner
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Partner ID: <strong>{partner?.partner_id}</strong>
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
            <Phone size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Mobile Number
              </div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">
                {partner?.mobile_number}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
            <Mail size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Email Address
              </div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">
                {partner?.email || "Not registered"}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
            <Truck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Vehicle Number
              </div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">
                {partner?.vehicle_number || "Not assigned"}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
            <Shield size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Account Status
              </div>
              <div className="font-bold text-emerald-700 text-sm mt-0.5">
                Verified & Enabled
              </div>
            </div>
          </div>
        </div>

        {/* Availability Controls */}
        <div className="border-t border-slate-100 pt-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Set Duty Status
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "Available", label: "Available", desc: "Ready for new deliveries", bg: "bg-emerald-600 text-white" },
              { id: "Busy", label: "Busy", desc: "Currently out on a run", bg: "bg-amber-500 text-white" },
              { id: "Offline", label: "Offline", desc: "Off duty / rest", bg: "bg-slate-700 text-white" },
            ].map((opt) => {
              const isSelected = partner?.availability_status === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleAvailability(opt.id)}
                  disabled={updating}
                  className={`p-3 rounded-xl border text-left transition ${
                    isSelected
                      ? `${opt.bg} shadow-md border-transparent`
                      : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="font-bold text-xs">{opt.label}</div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="border-t border-slate-100 pt-6 flex justify-end">
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-5 py-2.5 rounded-xl text-xs font-bold transition"
          >
            <LogOut size={16} />
            <span>Sign Out Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeliveryProfile;
