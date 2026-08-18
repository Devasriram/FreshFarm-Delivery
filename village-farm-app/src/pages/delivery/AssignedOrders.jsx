import { useEffect, useState } from "react";
import {
  Package,
  MapPin,
  Phone,
  CheckCircle2,
  Truck,
  ArrowRight,
  Clock,
  RefreshCw,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getAssignedOrders,
  updateOrderDeliveryStatus,
} from "../../services/deliveryPortalService";

function AssignedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAssignedOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === "Delivered") {
      const confirm = window.confirm(
        "Are you sure you want to mark this order as DELIVERED to the customer?"
      );
      if (!confirm) return;
    }

    try {
      setUpdatingId(orderId);
      await updateOrderDeliveryStatus(orderId, newStatus);
      await loadOrders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to update delivery status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;
    return order.delivery_status === filter;
  });

  const getNextAction = (status) => {
    switch (status) {
      case "Assigned":
        return {
          label: "Accept Delivery",
          nextStatus: "Accepted",
          btnColor: "bg-blue-600 hover:bg-blue-700 text-white",
        };
      case "Accepted":
        return {
          label: "Mark Picked Up",
          nextStatus: "Picked Up",
          btnColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
        };
      case "Picked Up":
        return {
          label: "Out for Delivery",
          nextStatus: "Out for Delivery",
          btnColor: "bg-amber-600 hover:bg-amber-700 text-white",
        };
      case "Out for Delivery":
        return {
          label: "Mark as Delivered",
          nextStatus: "Delivered",
          btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
        };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Assigned Deliveries ({orders.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Accept and update customer farm order delivery status in real-time
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="self-start sm:self-auto flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold shadow-sm transition"
        >
          <RefreshCw size={14} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All", "Assigned", "Accepted", "Picked Up", "Out for Delivery"].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              filter === st
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Package size={28} />
          </div>
          <h3 className="font-semibold text-slate-800 text-base">No Orders in this Status</h3>
          <p className="text-xs text-slate-500 mt-1">
            There are no assigned deliveries matching &quot;{filter}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredOrders.map((order) => {
            const nextAction = getNextAction(order.delivery_status);
            const isUpdating = updatingId === order.order_id;
            const isExpanded = expandedId === order.order_id;

            return (
              <div
                key={order.order_id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition hover:shadow-md"
              >
                {/* Order Header bar */}
                <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
                      #{order.order_number.slice(-4)}
                    </div>
                    <div>
                      <div className="font-bold text-sm leading-tight flex items-center gap-2">
                        <span>Order #{order.order_number}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Placed on {new Date(order.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.delivery_status === "Out for Delivery"
                          ? "bg-amber-400 text-slate-900"
                          : order.delivery_status === "Assigned"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                      }`}
                    >
                      Status: {order.delivery_status}
                    </span>
                  </div>
                </div>

                {/* Order Details Body */}
                <div className="p-5 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Customer & Address Details */}
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <MapPin size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Delivery Address
                          </div>
                          <div className="font-semibold text-sm text-slate-800 mt-0.5">
                            {order.customer_name}
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            {order.full_address}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <a
                          href={`tel:${order.mobile_number}`}
                          className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          <Phone size={13} />
                          <span>Call: {order.mobile_number}</span>
                        </a>
                      </div>
                    </div>

                    {/* Payment & Amount Breakdown */}
                    <div className="bg-slate-50 rounded-xl p-4 flex flex-col justify-between border border-slate-100">
                      <div>
                        <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                          <span>Payment Method:</span>
                          <span className="font-bold text-slate-800 uppercase">
                            {order.payment_method}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                          <span>Payment Status:</span>
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                              order.payment_status === "Paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-2.5 flex justify-between items-baseline">
                        <span className="text-xs font-bold text-slate-700">Amount to Collect:</span>
                        <span className="text-xl font-black text-emerald-700">
                          ₹{order.grand_total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items Toggle Button */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => toggleExpand(order.order_id)}
                      className="flex items-center justify-between w-full text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <ShoppingBag size={14} className="text-emerald-600" />
                        <span>Ordered Items ({order.items?.length || 0})</span>
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* Expanded Items List */}
                    {isExpanded && (
                      <div className="mt-3 bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-200">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-xs text-slate-700 pb-1.5 border-b border-slate-200/60 last:border-0 last:pb-0"
                          >
                            <div>
                              <span className="font-semibold text-slate-800">
                                {item.product_name}
                              </span>
                              <span className="text-slate-500 ml-2">
                                (Qty: {item.quantity} {item.unit})
                              </span>
                            </div>
                            <div className="font-bold text-slate-900">
                              ₹{item.total.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Workflow Action Bar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock size={14} />
                      <span>
                        Current Status: <strong className="text-slate-800">{order.delivery_status}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {nextAction && (
                        <button
                          onClick={() =>
                            handleStatusChange(order.order_id, nextAction.nextStatus)
                          }
                          disabled={isUpdating}
                          className={`${nextAction.btnColor} px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 min-w-[150px]`}
                        >
                          {isUpdating ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          ) : (
                            <>
                              <span>{nextAction.label}</span>
                              <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AssignedOrders;
