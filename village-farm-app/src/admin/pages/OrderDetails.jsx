import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderDetails,
  updateOrderStatus,
  assignDeliveryPartner,
  cancelOrderAdmin,
} from "../services/orderService";
import { getDeliveryPartners } from "../services/deliveryService";
import {
  ArrowLeft,
  Truck,
  User,
  MapPin,
  CreditCard,
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  Bike,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [status, setStatus] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("");
  const [updating, setUpdating] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("Cancelled by Admin");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrder();
    loadDeliveryPartners();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderDetails(id);
      setOrder(data);
      setStatus(data.order_status);
      setEstimatedDeliveryTime(data.estimated_delivery_time || "Today within 2-3 hours");
      if (data.delivery_partner_id) {
        setPartnerId(String(data.delivery_partner_id));
      }
    } catch (err) {
      console.error(err);
      alert("Unable to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const loadDeliveryPartners = async () => {
    try {
      const data = await getDeliveryPartners();
      setDeliveryPartners(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      await updateOrderStatus(id, status, estimatedDeliveryTime);
      alert("Order status and delivery estimate updated successfully!");
      await loadOrder();
    } catch (err) {
      console.error(err);
      alert("Unable to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignPartner = async () => {
    if (!partnerId) {
      alert("Please select a delivery partner to assign.");
      return;
    }
    try {
      setAssigning(true);
      await assignDeliveryPartner(id, parseInt(partnerId), estimatedDeliveryTime);
      alert("Delivery partner assigned successfully!");
      await loadOrder();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Unable to assign partner.");
    } finally {
      setAssigning(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      await cancelOrderAdmin(id, cancelReason);
      setShowCancelModal(false);
      await loadOrder();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Loading Order Details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto mt-10">
        <h2 className="text-2xl font-bold text-slate-800">Order Not Found</h2>
        <button
          onClick={() => navigate("/admin/orders")}
          className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const isCancelled = order.order_status === "Cancelled";
  const isDelivered = order.order_status === "Delivered";

  return (
    <div className="space-y-6">
      {/* Header & Back Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate("/admin/orders")}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm transition self-start"
        >
          <ArrowLeft size={18} />
          <span>Back to Order Tracking</span>
        </button>

        <div className="flex items-center gap-3">
          {!isCancelled && !isDelivered && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
            >
              <XCircle size={14} />
              <span>Cancel Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black">
              Order #{order.order_number}
            </h1>
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                isDelivered
                  ? "bg-emerald-500 text-white"
                  : isCancelled
                  ? "bg-red-500 text-white"
                  : "bg-amber-400 text-slate-900"
              }`}
            >
              {order.order_status}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <Calendar size={13} />
            <span>Ordered on {new Date(order.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <Clock size={20} className="text-emerald-400 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Estimated Delivery
            </div>
            <div className="text-sm font-bold text-emerald-300">
              {order.estimated_delivery_time || "Today within 2-3 hours"}
            </div>
          </div>
        </div>
      </div>

      {/* Control Center: Status Updater & Partner Assignment */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Update Status & ETA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Clock className="text-emerald-600" size={18} />
            <h3 className="font-extrabold text-sm text-slate-900">
              Order Status & Fulfillment ETA
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Order Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Picked Up">Picked Up</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Estimated Delivery Time
              </label>
              <input
                type="text"
                value={estimatedDeliveryTime}
                onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                placeholder="e.g. Today by 5:30 PM, Within 2 hours"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={handleUpdateStatus}
              disabled={updating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md disabled:opacity-50"
            >
              {updating ? "Updating..." : "Save Status & ETA"}
            </button>
          </div>
        </div>

        {/* Assign Delivery Partner */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Truck className="text-emerald-600" size={18} />
            <h3 className="font-extrabold text-sm text-slate-900">
              Delivery Partner Assignment
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {order.delivery_partner && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900">
                <div className="font-bold flex items-center gap-1.5">
                  <Bike size={15} />
                  <span>Currently Assigned: {order.delivery_partner.partner_name}</span>
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  ID: {order.delivery_partner.partner_id} • Tel: {order.delivery_partner.mobile_number}
                  {order.delivery_partner.vehicle_number && ` • Vehicle: ${order.delivery_partner.vehicle_number}`}
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Select / Reassign Partner
              </label>
              <select
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Choose Delivery Partner --</option>
                {deliveryPartners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.partner_name} ({p.partner_id || `DP${p.id}`}) • {p.availability_status || "Available"}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssignPartner}
              disabled={assigning || !partnerId}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md disabled:opacity-50"
            >
              {assigning ? "Assigning..." : "Assign Delivery Partner"}
            </button>
          </div>
        </div>
      </div>

      {/* Historical Delivery Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <History className="text-indigo-600" size={18} />
          <h3 className="font-extrabold text-sm text-slate-900">
            Fulfillment & Delivery Timeline
          </h3>
        </div>

        <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {order.timeline?.map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-3 pl-7">
              <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white ring-2 ring-indigo-100"></div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex-1">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">{step.status}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(step.updated_at).toLocaleString()}
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Action logged by: <strong className="text-slate-700">{step.updated_by}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer & Destination Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-3 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="text-emerald-600" size={18} />
            <h3 className="font-extrabold text-sm text-slate-900">Customer Details</h3>
          </div>
          <div className="space-y-1 text-slate-600">
            <div><strong>Name:</strong> {order.customer_name}</div>
            <div><strong>Mobile:</strong> {order.mobile_number}</div>
            {order.email && <div><strong>Email:</strong> {order.email}</div>}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-3 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="text-emerald-600" size={18} />
            <h3 className="font-extrabold text-sm text-slate-900">Delivery Address</h3>
          </div>
          <div className="space-y-1 text-slate-600 leading-relaxed">
            <div>{order.door_street}</div>
            <div>{order.village}, {order.district}</div>
            <div>{order.state} - <strong>{order.pincode}</strong></div>
            {order.landmark && <div className="text-slate-500 mt-1 font-medium">Landmark: {order.landmark}</div>}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-4 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Package className="text-emerald-600" size={18} />
          <h3 className="font-extrabold text-sm text-slate-900">
            Ordered Products ({order.items?.length || 0})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 tracking-wider">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5 text-center">Unit Price</th>
                <th className="p-3.5 text-center">Quantity</th>
                <th className="p-3.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-3.5 flex items-center gap-3">
                    <img
                      src={
                        item.product_image
                          ? `/images/products/${item.product_image}`
                          : "https://placehold.co/60x60"
                      }
                      alt={item.product_name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/60x60";
                      }}
                    />
                    <span className="font-bold text-slate-800">{item.product_name}</span>
                  </td>
                  <td className="p-3.5 text-center font-medium text-slate-700">₹{item.price}</td>
                  <td className="p-3.5 text-center font-bold text-slate-900">{item.quantity}</td>
                  <td className="p-3.5 text-right font-black text-emerald-700">₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col items-end gap-1 text-xs">
          <div className="flex justify-between w-64 text-slate-500">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-700">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between w-64 text-slate-500">
            <span>Delivery:</span>
            <span className="font-semibold text-slate-700">₹{order.delivery_charge}</span>
          </div>
          <div className="flex justify-between w-64 text-slate-500">
            <span>GST (5%):</span>
            <span className="font-semibold text-slate-700">₹{order.gst}</span>
          </div>
          <div className="flex justify-between w-64 text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Grand Total:</span>
            <span className="text-base text-emerald-700">₹{order.grand_total}</span>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">
                Cancel Order #{order.order_number}?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Products will be restocked automatically.
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
                onClick={() => setShowCancelModal(false)}
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

export default AdminOrderDetails;