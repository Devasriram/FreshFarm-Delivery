import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOrders,
  updateOrderStatus,
  assignDeliveryPartner,
  getOrderTimeline,
  cancelOrderAdmin,
} from "../services/orderService";
import { getDeliveryPartners } from "../services/deliveryService";
import {
  Search,
  Truck,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Calendar,
  Eye,
  RefreshCw,
  X,
  History,
  Bike,
  AlertCircle,
} from "lucide-react";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [assignModalOrder, setAssignModalOrder] = useState(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const [timelineModalOrder, setTimelineModalOrder] = useState(null);
  const [timelineData, setTimelineData] = useState(null);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("Customer requested cancellation");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, partnersData] = await Promise.all([
        getOrders(),
        getDeliveryPartners(),
      ]);
      setOrders(ordersData);
      setPartners(partnersData);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders or delivery partners.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  const openAssignModal = (order) => {
    setAssignModalOrder(order);
    setSelectedPartnerId(order.delivery_partner_id || "");
  };

  const handleAssignPartner = async () => {
    if (!selectedPartnerId) {
      alert("Please select a delivery partner.");
      return;
    }
    try {
      setAssigning(true);
      await assignDeliveryPartner(assignModalOrder.id, parseInt(selectedPartnerId));
      setAssignModalOrder(null);
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to assign delivery partner.");
    } finally {
      setAssigning(false);
    }
  };

  const openTimelineModal = async (order) => {
    setTimelineModalOrder(order);
    try {
      setLoadingTimeline(true);
      const data = await getOrderTimeline(order.id);
      setTimelineData(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load delivery timeline.");
    } finally {
      setLoadingTimeline(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelModalOrder) return;
    try {
      setCancelling(true);
      await cancelOrderAdmin(cancelModalOrder.id, cancelReason);
      setCancelModalOrder(null);
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const term = search.toLowerCase();
    const matchesNumber = order.order_number?.toLowerCase().includes(term);
    const matchesCustomer = order.customer_name?.toLowerCase().includes(term);
    const matchesPartner = order.delivery_partner?.partner_name?.toLowerCase().includes(term);
    const matchesProduct = order.products?.some((p) =>
      p.product_name?.toLowerCase().includes(term)
    );

    const matchesSearch = !search || matchesNumber || matchesCustomer || matchesPartner || matchesProduct;

    let matchesStatus = true;
    if (statusFilter !== "All") {
      matchesStatus = order.order_status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (st) => {
    switch (st) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Out for Delivery":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "Preparing":
      case "Picked Up":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Loading Order Tracking Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>Admin Order Tracking & Fulfillment</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {orders.length} Total
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor live deliveries, assign delivery partners, update statuses, and inspect fulfillment timelines
          </p>
        </div>

        <button
          onClick={loadData}
          className="self-start sm:self-auto flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold shadow-sm transition"
        >
          <RefreshCw size={14} />
          <span>Refresh Tracking</span>
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, Delivery Partner, or Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            "All",
            "Pending",
            "Confirmed",
            "Preparing",
            "Picked Up",
            "Out for Delivery",
            "Delivered",
            "Cancelled",
          ].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? "bg-slate-900 text-white shadow"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Tracking Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Delivery Partner</th>
                <th className="p-3.5">Products</th>
                <th className="p-3.5">Order Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Est. Delivery Time</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-slate-400">
                    No orders matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition">
                    {/* Order ID */}
                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-900">
                        #{order.order_number}
                      </div>
                      <div className="text-[10px] text-slate-400">ID: {order.id}</div>
                    </td>

                    {/* Customer */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-800">{order.customer_name}</div>
                      <div className="text-[11px] text-slate-500">{order.mobile_number}</div>
                    </td>

                    {/* Delivery Partner */}
                    <td className="p-3.5">
                      {order.delivery_partner ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-emerald-800 flex items-center gap-1">
                            <Bike size={13} className="text-emerald-600 shrink-0" />
                            <span>{order.delivery_partner.partner_name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {order.delivery_partner.partner_id} • {order.delivery_partner.mobile_number}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => openAssignModal(order)}
                          className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2 py-1 rounded-lg text-[11px] font-bold transition"
                        >
                          <Truck size={12} />
                          <span>Assign Partner</span>
                        </button>
                      )}
                    </td>

                    {/* Products */}
                    <td className="p-3.5 max-w-[200px]">
                      <div className="truncate font-medium text-slate-800" title={order.products?.map(p => `${p.product_name} (x${p.quantity})`).join(", ")}>
                        {order.products?.[0]?.product_name || "Products"}
                        {order.products?.length > 1 && (
                          <span className="text-slate-500 ml-1">
                            +{order.products.length - 1} more
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Total: <strong className="text-slate-700">₹{order.total_amount}</strong>
                      </div>
                    </td>

                    {/* Order Date */}
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      <div>{new Date(order.created_at).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(order.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* Current Status */}
                    <td className="p-3.5">
                      <select
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${getStatusBadgeClass(
                          order.order_status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Picked Up">Picked Up</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Estimated Delivery Time */}
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold">
                        <Clock size={11} className="text-slate-500" />
                        {order.estimated_delivery_time || "Today (2-3 hrs)"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openTimelineModal(order)}
                          className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
                          title="View Delivery Timeline"
                        >
                          <History size={14} />
                        </button>

                        <button
                          onClick={() => openAssignModal(order)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                          title="Assign / Reassign Partner"
                        >
                          <Truck size={14} />
                        </button>

                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>

                        {order.order_status !== "Delivered" && order.order_status !== "Cancelled" && (
                          <button
                            onClick={() => setCancelModalOrder(order)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                            title="Cancel Order"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Partner Modal */}
      {assignModalOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900">
                <Truck className="text-emerald-600" size={20} />
                <h3 className="font-bold text-base">Assign Delivery Partner</h3>
              </div>
              <button
                onClick={() => setAssignModalOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>Order: <strong className="text-slate-800">#{assignModalOrder.order_number}</strong></div>
                <div>Customer: <strong className="text-slate-800">{assignModalOrder.customer_name}</strong></div>
                <div>Address: <span className="text-slate-600">{assignModalOrder.village || "Delivery Location"}</span></div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Delivery Partner
                </label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => setSelectedPartnerId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Choose Partner --</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.partner_name} ({p.partner_id || `DP${p.id}`}) • {p.availability_status || "Available"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setAssignModalOrder(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignPartner}
                disabled={assigning || !selectedPartnerId}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md disabled:opacity-50"
              >
                {assigning ? "Assigning..." : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Timeline Modal */}
      {timelineModalOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900">
                <History className="text-indigo-600" size={20} />
                <h3 className="font-bold text-base">
                  Delivery Timeline #{timelineModalOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => {
                  setTimelineModalOrder(null);
                  setTimelineData(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {loadingTimeline ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-xs text-slate-500 mt-2">Loading historical timeline...</p>
              </div>
            ) : timelineData ? (
              <div className="space-y-4 text-xs">
                {timelineData.delivery_partner && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-emerald-900">
                    <div>
                      <div className="font-bold">Assigned Partner: {timelineData.delivery_partner.partner_name}</div>
                      <div className="text-[11px] text-emerald-700">
                        {timelineData.delivery_partner.partner_id} • {timelineData.delivery_partner.mobile_number}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                )}

                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {timelineData.timeline?.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-7">
                      <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white ring-2 ring-indigo-100"></div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{step.status}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(step.updated_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Updated by: <strong className="text-slate-700">{step.updated_by}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400">No timeline data available.</div>
            )}

            <button
              onClick={() => {
                setTimelineModalOrder(null);
                setTimelineData(null);
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">
                Cancel Order #{cancelModalOrder.order_number}?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to cancel this order? Products will be restocked automatically.
              </p>
            </div>

            <div className="text-left text-xs">
              <label className="font-bold text-slate-700 block mb-1">Reason for cancellation:</label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;