import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Package,
  Download,
  RotateCcw,
  XCircle,
  Phone,
  Bike,
  Clock,
  CheckCircle2,
  Calendar,
  Truck,
  ShieldCheck,
} from "lucide-react";

import {
  getOrderById,
  getOrderTracking,
  cancelOrder,
  reorderOrder,
} from "../services/orderService";

import OrderTrackingTimeline from "../components/OrderTrackingTimeline";
import CancelOrderModal from "../components/CancelOrderModal";
import InvoiceModal from "../components/InvoiceModal";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingCancel, setProcessingCancel] = useState(false);
  const [processingReorder, setProcessingReorder] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const [orderData, trackingData] = await Promise.all([
        getOrderById(id),
        getOrderTracking(id),
      ]);
      setOrder(orderData);
      setTracking(trackingData);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Unable to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setProcessingCancel(true);
      await cancelOrder(id);
      setShowCancelModal(false);
      await loadOrder();
    } catch (err) {
      alert(err.response?.data?.detail || "Unable to cancel order.");
    } finally {
      setProcessingCancel(false);
    }
  };

  const handleReorder = async () => {
    try {
      setProcessingReorder(true);
      await reorderOrder(id);
      navigate("/cart");
    } catch (err) {
      alert(err.response?.data?.detail || "Unable to reorder products.");
    } finally {
      setProcessingReorder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Loading Order Tracking & Details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-slate-800">Order Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">
            The requested order could not be located or you may not have permission to view it.
          </p>
          <button
            onClick={() => navigate("/my-orders")}
            className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-md"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  const partner = tracking?.delivery_partner || order.delivery_partner;
  const isCancelled = order.order_status === "Cancelled";
  const isDelivered = order.order_status === "Delivered";
  const canCancel = !isCancelled && !isDelivered && ["Pending", "Order Placed", "Confirmed"].includes(order.order_status);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Back navigation & Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate("/my-orders")}
            className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm transition self-start"
          >
            <ArrowLeft size={18} />
            <span>Back to All Orders</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInvoice(true)}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Download size={14} className="text-emerald-600" />
              <span>Invoice</span>
            </button>

            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
              >
                <XCircle size={14} />
                <span>Cancel Order</span>
              </button>
            )}

            {(isDelivered || isCancelled) && (
              <button
                onClick={handleReorder}
                disabled={processingReorder}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                <RotateCcw size={14} />
                <span>{processingReorder ? "Adding to Cart..." : "Reorder"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Order Banner Bar */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <span>Placed on {new Date(order.created_at).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <Clock size={20} className="text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Estimated Delivery
              </div>
              <div className="text-sm font-bold text-emerald-300">
                {tracking?.estimated_delivery_time || order.estimated_delivery_time || "Today within 2-3 hours"}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Partner Assigned Card (If Assigned) */}
        {partner && (
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white rounded-2xl p-6 shadow-sm border border-emerald-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 text-white flex items-center justify-center shrink-0 border border-white/20">
                  <Bike size={24} />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                    Assigned Delivery Partner
                  </div>
                  <div className="text-lg font-bold flex items-center gap-2">
                    <span>{partner.partner_name}</span>
                    <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-md">
                      {partner.partner_id || `DP${partner.id}`}
                    </span>
                  </div>
                  {partner.vehicle_number && (
                    <div className="text-xs text-emerald-100/90 mt-0.5">
                      Vehicle: <span className="font-semibold">{partner.vehicle_number}</span>
                    </div>
                  )}
                </div>
              </div>

              {partner.mobile_number && (
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${partner.mobile_number}`}
                    className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-emerald-900 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
                  >
                    <Phone size={14} className="text-emerald-700" />
                    <span>Call Partner: {partner.mobile_number}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tracking Timeline */}
        <OrderTrackingTimeline tracking={tracking} />

        {/* Order Details Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Products & Delivery Address */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                <Package className="text-emerald-600" size={20} />
                <h3 className="text-base font-extrabold text-slate-900">
                  Ordered Fresh Products ({order.items?.length || 0})
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.product?.product_image
                            ? `/images/products/${item.product.product_image}`
                            : "https://placehold.co/100x100"
                        }
                        alt={item.product?.product_name || "Product"}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/100x100";
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">
                          {item.product?.product_name}
                        </h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          ₹{item.price} each {item.product?.unit ? `• per ${item.product.unit}` : ""}
                        </div>
                        <div className="text-xs font-semibold text-emerald-700 mt-1">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-sm text-slate-900">
                        ₹{item.total}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <MapPin className="text-emerald-600" size={20} />
                <h3 className="text-base font-extrabold text-slate-900">
                  Delivery Destination
                </h3>
              </div>

              <div className="text-xs text-slate-700 space-y-1 leading-relaxed">
                <div className="font-bold text-sm text-slate-900">{order.full_name}</div>
                <div className="flex items-center gap-1.5 text-slate-600 pt-0.5">
                  <Phone size={12} className="text-slate-400" />
                  <span>{order.mobile_number}</span>
                </div>
                <div className="text-slate-600 pt-1">{order.door_street}</div>
                <div className="text-slate-600">
                  {order.village}, {order.district}
                </div>
                <div className="text-slate-600">
                  {order.state} - <strong className="text-slate-800">{order.pincode}</strong>
                </div>
                {order.landmark && (
                  <div className="mt-2 inline-block bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-slate-600 font-medium">
                    Landmark: {order.landmark}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Col: Payment Summary & Order Info */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <CreditCard className="text-emerald-600" size={20} />
                <h3 className="text-base font-extrabold text-slate-900">
                  Payment Summary
                </h3>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{order.total_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-slate-800">
                    {order.delivery_charge === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${order.delivery_charge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-slate-800">₹{order.gst}</span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-800">Grand Total</span>
                  <span className="text-xl font-black text-emerald-700">
                    ₹{order.grand_total}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Method:</span>
                    <span className="font-bold text-slate-800 uppercase">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Payment Status:</span>
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
              </div>
            </div>

            {/* Farm Fresh Guarantee */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200/80 flex items-start gap-3.5">
              <ShieldCheck className="text-emerald-700 shrink-0 mt-0.5" size={22} />
              <div>
                <h4 className="font-bold text-xs text-emerald-900">Farm Fresh Guarantee</h4>
                <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                  Every product is harvested and sorted fresh from local village farms. Questions? Reach out to support anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CancelOrderModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        loading={processingCancel}
      />

      <InvoiceModal
        open={showInvoice}
        onClose={() => setShowInvoice(false)}
        order={order}
      />
    </div>
  );
}

export default OrderDetails;