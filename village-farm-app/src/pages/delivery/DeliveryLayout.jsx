import { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PackageCheck,
  History,
  User,
  LogOut,
  Truck,
  Circle,
  Menu,
  X,
} from "lucide-react";
import { DeliveryAuthContext } from "../../context/DeliveryAuthContext";
import { updateAvailabilityStatus } from "../../services/deliveryPortalService";

function DeliveryLayout() {
  const navigate = useNavigate();
  const { partner, logout, updatePartnerState } = useContext(DeliveryAuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/delivery/login");
  };

  const handleStatusToggle = async (newStatus) => {
    try {
      setUpdatingAvailability(true);
      await updateAvailabilityStatus(newStatus);
      updatePartnerState({ availability_status: newStatus });
    } catch (err) {
      console.error(err);
      alert("Failed to update availability status.");
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/delivery/dashboard", icon: LayoutDashboard },
    { name: "Assigned Orders", path: "/delivery/assigned-orders", icon: PackageCheck },
    { name: "Delivery History", path: "/delivery/history", icon: History },
    { name: "Profile", path: "/delivery/profile", icon: User },
  ];

  const currentStatus = partner?.availability_status || "Available";

  const getStatusColor = (st) => {
    switch (st) {
      case "Available":
        return "bg-emerald-500 text-emerald-700 bg-emerald-50 border-emerald-300";
      case "Busy":
        return "bg-amber-500 text-amber-700 bg-amber-50 border-amber-300";
      default:
        return "bg-slate-400 text-slate-700 bg-slate-100 border-slate-300";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0">
      {/* Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Truck size={22} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-base leading-tight tracking-wide flex items-center gap-1.5">
                <span>FreshFarm Delivery</span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase">
                  Partner
                </span>
              </div>
              <div className="text-xs text-slate-400">
                {partner?.partner_name} ({partner?.partner_id || "DP"})
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/60"
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right section: Availability & Logout */}
          <div className="flex items-center gap-3">
            <select
              value={currentStatus}
              disabled={updatingAvailability}
              onChange={(e) => handleStatusToggle(e.target.value)}
              className="bg-slate-800 text-xs font-semibold text-white border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Available">🟢 Available</option>
              <option value="Busy">🟡 Busy</option>
              <option value="Offline">⚪ Offline</option>
            </select>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 hover:text-red-400 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 px-3 py-1.5 rounded-lg transition"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-40">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 text-xs font-medium transition ${
                    isActive
                      ? "text-emerald-600 font-bold"
                      : "text-slate-500 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-[11px]">{item.name.split(" ")[0]}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DeliveryLayout;
