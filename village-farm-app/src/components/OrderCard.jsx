import { useNavigate } from "react-router-dom";
import OrderStatusBadge from "./OrderStatusBadge";

function OrderCard({ order }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6">

      <div className="grid md:grid-cols-5 gap-6 items-center">

        {/* Order Number */}

        <div>

          <p className="text-gray-500 text-sm">
            Order Number
          </p>

          <h2 className="text-lg font-bold text-green-700">
            {order.order_number}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {new Date(order.created_at).toLocaleString()}
          </p>

        </div>

        {/* Payment */}

        <div>

          <p className="text-gray-500 text-sm">
            Payment Method
          </p>

          <p className="font-semibold mt-1">
            {order.payment_method}
          </p>

          <p className="text-gray-500 text-sm mt-2">
            Payment Status
          </p>

          <OrderStatusBadge
            status={order.payment_status}
            type="payment"
          />

        </div>

        {/* Order Status */}

        <div>

          <p className="text-gray-500 text-sm">
            Order Status
          </p>

          <OrderStatusBadge
            status={order.order_status}
            type="order"
          />

        </div>

        {/* Total */}

        <div>

          <p className="text-gray-500 text-sm">
            Grand Total
          </p>

          <h2 className="text-2xl font-bold text-green-700">
            ₹{order.grand_total}
          </h2>

        </div>

        {/* Action */}

        <div className="text-right">

          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            View Details
          </button>

        </div>

      </div>

    </div>
  );
}

export default OrderCard;