import { CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state;

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">

      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-10 text-center">

        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircle
            size={90}
            className="text-green-600"
          />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mt-6">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Thank you for shopping with
          <span className="font-semibold text-green-700">
            {" "}Village Fresh Farm
          </span>.
        </p>

        {/* Order Details */}
        <div className="mt-8 bg-green-100 rounded-xl p-5">

          <h3 className="text-lg font-semibold text-gray-700">
            Order Number
          </h3>

          <p className="text-2xl font-bold text-green-700 mt-2">
            {order?.order_number || "N/A"}
          </p>

          <p className="text-sm text-gray-600 mt-3">
            Order ID : {order?.order_id || "N/A"}
          </p>

        </div>

        {/* Delivery Message */}
        <div className="mt-8 space-y-2 text-gray-600">

          <p>
            🚚 Your fresh farm products will be delivered soon.
          </p>

          <p>
            📱 You will receive order updates on your registered mobile number.
          </p>

          <p>
            ❤️ Thank you for supporting local farmers.
          </p>

        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

          <button
            onClick={() => navigate("/home")}
            className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-xl font-semibold transition"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="border border-green-700 text-green-700 hover:bg-green-50 px-8 py-4 rounded-xl font-semibold transition"
          >
            View My Orders
          </button>

        </div>

      </div>

    </div>
  );
}

export default OrderSuccess;