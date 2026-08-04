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

  const [processingCancel, setProcessingCancel] =
    useState(false);

  const [processingReorder, setProcessingReorder] =
    useState(false);
  
  const [showCancelModal, setShowCancelModal] =
    useState(false);
   
  const [showInvoice, setShowInvoice] =
    useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  // ---------------------------------------
  // Load Order
  // ---------------------------------------

  const loadOrder = async () => {
    try {

      setLoading(true);

      const orderData =
        await getOrderById(id);

      setOrder(orderData);

      const trackingData =
        await getOrderTracking(id);

      setTracking(trackingData);

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.detail ||
        "Unable to load order."
      );

    } finally {

      setLoading(false);

    }
  };

  // ---------------------------------------
  // Cancel Order
  // ---------------------------------------

  const handleCancel = async () => {

  try {

    setProcessingCancel(true);

    await cancelOrder(id);

    alert("Order cancelled successfully.");

    setShowCancelModal(false);

    await loadOrder();

  } catch (err) {

    alert(
      err.response?.data?.detail ||
      "Unable to cancel order."
    );

  } finally {

    setProcessingCancel(false);

  }

};

  // ---------------------------------------
  // Reorder
  // ---------------------------------------

  const handleReorder = async () => {

    try {

      setProcessingReorder(true);

      await reorderOrder(id);

      alert(
        "Products added to cart successfully."
      );

      navigate("/cart");

    } catch (err) {

      alert(
        err.response?.data?.detail ||
        "Unable to reorder."
      );

    } finally {

      setProcessingReorder(false);

    }

  };

  // ---------------------------------------
  // Download Invoice (Placeholder)
  // ---------------------------------------

  const handleInvoice = () => {
  setShowInvoice(true);
};

  // ---------------------------------------
  // Loading
  // ---------------------------------------

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-xl font-semibold">
          Loading Order...
        </div>

      </div>

    );

  }

  // ---------------------------------------
  // No Order
  // ---------------------------------------

  if (!order) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <h2 className="text-3xl font-bold">
            Order Not Found
          </h2>

          <button
            onClick={() => navigate("/my-orders")}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Back to My Orders
          </button>

        </div>

      </div>

    );

  }

  return (
  <div className="min-h-screen bg-gray-100 py-8">

    <div className="max-w-6xl mx-auto px-4">

      {/* Back Button */}

      <button
        onClick={() => navigate("/my-orders")}
        className="flex items-center gap-2 text-green-700 font-semibold mb-6 hover:text-green-800"
      >
        <ArrowLeft size={20} />
        Back to My Orders
      </button>

      {/* Header */}

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Order #{order.order_number}
            </h1>

            <p className="text-gray-500 mt-2">
              {new Date(order.created_at).toLocaleString()}
            </p>

          </div>

          <div className="mt-5 md:mt-0">

            <span
              className={`px-4 py-2 rounded-full font-semibold
              ${
                order.order_status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : order.order_status === "Cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.order_status}
            </span>

          </div>

        </div>

      </div>

      {/* Tracking */}

      <div className="mb-6">

        <OrderTrackingTimeline
          tracking={tracking}
        />

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left */}

        <div className="lg:col-span-2 space-y-6">

          {/* Products */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex items-center gap-2 mb-5">

              <Package className="text-green-700" />

              <h2 className="text-xl font-bold">
                Ordered Products
              </h2>

            </div>

            {order.items.map((item) => (

              <div
                key={item.id}
                className="flex items-center justify-between border rounded-xl p-4 mb-4"
              >

                <div className="flex gap-4">

                  <img
                    src={
                     item.product.product_image
                     ? `/images/products/${item.product.product_image}`
                      : "https://placehold.co/100x100"
                       }
                    alt={item.product.product_name}
                    className="w-24 h-24 rounded-lg object-cover border"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/100x100";
                    }}
                    />

                  <div>

                    <h3 className="font-bold text-lg">
                      {item.product.product_name}
                    </h3>

                    <p className="text-gray-500">
                      Qty : {item.quantity}
                    </p>

                    <p className="text-gray-500">
                      ₹{item.price} each
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <div className="text-xl font-bold text-green-700">

                    ₹{item.total}

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* Delivery Address */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex items-center gap-2 mb-5">

              <MapPin className="text-green-700" />

              <h2 className="text-xl font-bold">
                Delivery Address
              </h2>

            </div>

            <div className="space-y-2">

              <p className="font-semibold">
                {order.full_name}
              </p>

              <p>
                {order.mobile_number}
              </p>

              <p>
                {order.door_street}
              </p>

              <p>
                {order.village}
              </p>

              <p>
                {order.district},
                {" "}
                {order.state}
              </p>

              <p>
                {order.pincode}
              </p>

              {order.landmark && (
                <p>
                  Landmark :
                  {" "}
                  {order.landmark}
                </p>
              )}

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="space-y-6">

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex items-center gap-2 mb-5">

              <CreditCard className="text-green-700" />

              <h2 className="text-xl font-bold">
                Payment Summary
              </h2>

            </div>

            <div className="space-y-3">

              <div className="flex justify-between">

                <span>Subtotal</span>

                <span>
                  ₹{order.total_amount}
                </span>

              </div>

              <div className="flex justify-between">

                <span>Delivery</span>

                <span>
                  ₹{order.delivery_charge}
                </span>

              </div>

              <div className="flex justify-between">

                <span>GST</span>

                <span>
                  ₹{order.gst}
                </span>

              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">

                <span>Total</span>

                <span className="text-green-700">

                  ₹{order.grand_total}

                </span>

              </div>

              <div className="pt-4">

                <p>

                  <b>Payment:</b>

                  {" "}

                  {order.payment_method}

                </p>

                <p>

                  <b>Status:</b>

                  {" "}

                  {order.payment_status}

                </p>

              </div>

            </div>

          </div>
                    {/* Actions */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Order Actions
            </h2>

            <div className="space-y-4">

              {order.order_status === "Pending" && (

                <button
                  onClick={() => setShowCancelModal(true)}
                  disabled={processingCancel}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg disabled:opacity-50"
                >
                  <XCircle size={18} />

                  {processingCancel
                    ? "Cancelling..."
                    : "Cancel Order"}

                </button>

              )}

              {order.order_status === "Delivered" && (

                <button
                  onClick={handleReorder}
                  disabled={processingReorder}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg disabled:opacity-50"
                >
                  <RotateCcw size={18} />

                  {processingReorder
                    ? "Reordering..."
                    : "Reorder"}

                </button>

              )}

              <button
                onClick={handleInvoice}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
              >
                <Download size={18} />

                Download Invoice

              </button>

            </div>

          </div>

          {/* Order Information */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Order Information
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Order ID
                </span>

                <span className="font-medium">
                  #{order.id}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Order Number
                </span>

                <span className="font-medium">
                  {order.order_number}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Ordered On
                </span>

                <span className="font-medium">
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Payment Method
                </span>

                <span className="font-medium">
                  {order.payment_method}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Payment Status
                </span>

                <span className="font-medium">
                  {order.payment_status}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Order Status
                </span>

                <span className="font-semibold text-green-700">
                  {order.order_status}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
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