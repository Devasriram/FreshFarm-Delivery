import { CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">
            No Order Found
          </h2>

          <button
            onClick={() => navigate("/home")}
            className="bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">

      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-10">

        <div className="flex justify-center">
          <CheckCircle
            size={90}
            className="text-green-600"
          />
        </div>

        <h1 className="text-4xl font-bold text-center mt-6">
          Order Placed Successfully!
        </h1>

        <p className="text-center text-gray-600 mt-3">
          Thank you for shopping with
          <span className="font-bold text-green-700">
            {" "}Village Fresh Farm
          </span>
        </p>

        <div className="mt-8 bg-green-100 rounded-xl p-6 space-y-3">

          <div className="flex justify-between">
            <span className="font-semibold">
              Order Number
            </span>

            <span>{order.order_number}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">
              Order ID
            </span>

            <span>{order.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">
              Payment Method
            </span>

            <span>
              {order.payment_method?.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">
              Payment Status
            </span>

            <span>{order.payment_status}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">
              Order Status
            </span>

            <span>{order.order_status}</span>
          </div>

          <div className="flex justify-between text-xl font-bold border-t pt-4">

            <span>Grand Total</span>

            <span className="text-green-700">
              ₹{order.grand_total}
            </span>

          </div>

        </div>

        <div className="mt-8">

          <h3 className="font-bold mb-4">
            Ordered Items
          </h3>

          <div className="space-y-3">

            {order.items?.map((item) => (

              <div
                key={item.id}
                className="flex justify-between border rounded-lg p-3"
              >

                <div>

                  <div className="font-semibold">
                    {item.product.product_name}
                  </div>

                  <div className="text-sm text-gray-500">
                    Qty : {item.quantity}
                  </div>

                </div>

                <div className="font-bold">
                  ₹{item.total}
                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="flex gap-4 mt-10">

          <button
            onClick={() => navigate("/home")}
            className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="flex-1 border border-green-700 text-green-700 py-3 rounded-xl"
          >
            My Orders
          </button>

        </div>

      </div>

    </div>
  );
}

export default OrderSuccess;