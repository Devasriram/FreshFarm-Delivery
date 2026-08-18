import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Phone,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Truck,
} from "lucide-react";
import { DeliveryAuthContext } from "../../context/DeliveryAuthContext";
import {
  getDeliveryDashboardStats,
  getAssignedOrders,
} from "../../services/deliveryPortalService";

function DeliveryDashboard() {
  const { partner } = useContext(DeliveryAuthContext);

  const [stats, setStats] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [statsData, ordersData] = await Promise.all([
        getDeliveryDashboardStats(),
        getAssignedOrders(),
      ]);
      setStats(statsData);
      setActiveOrders(ordersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Deliveries",
      value: stats?.today_deliveries || 0,
      icon: Clock,
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      title: "Pending Deliveries",
      value: stats?.pending_deliveries || 0,
      icon: Package,
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50",
    },
    {
      title: "Completed Deliveries",
      value: stats?.completed_deliveries || 0,
      icon: CheckCircle2,
      color: "from-emerald-500 to-green-600",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50",
    },
    {
      title: "Total Delivered (₹)",
      value: `₹${(stats?.total_earnings || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: "from-purple-600 to-pink-600",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {partner?.availability_status || "Active"} Mode
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Hello, {partner?.partner_name} 👋
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Partner ID: <span className="font-mono text-emerald-400 font-semibold">{partner?.partner_id}</span> • Vehicle: {partner?.vehicle_number || "Not specified"}
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={refreshing}
            className="self-start sm:self-auto flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm font-medium transition disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bgLight} ${card.textColor}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Deliveries Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Active Deliveries ({activeOrders.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Orders currently assigned and ready for action
            </p>
          </div>
          <Link
            to="/delivery/assigned-orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {activeOrders.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-semibold text-slate-800">No Pending Deliveries!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You are all caught up. When admin assigns you fresh village farm orders, they will appear here immediately.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.slice(0, 3).map((order) => (
              <div
                key={order.order_id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">
                      Order #{order.order_number}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.delivery_status === "Out for Delivery"
                          ? "bg-amber-100 text-amber-800"
                          : order.delivery_status === "Accepted" || order.delivery_status === "Picked Up"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {order.delivery_status}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      • {order.payment_method} (₹{order.grand_total})
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5 text-xs text-slate-600">
                    <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>{order.full_address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <span>Customer: {order.customer_name}</span>
                    <span>•</span>
                    <a
                      href={`tel:${order.mobile_number}`}
                      className="text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <Phone size={12} /> {order.mobile_number}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <Link
                    to="/delivery/assigned-orders"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition"
                  >
                    Manage Status
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryDashboard;
