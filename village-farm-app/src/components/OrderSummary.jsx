import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function OrderSummary() {
  const navigate = useNavigate();

  const {
    cart,
    totalItems,
    totalAmount,
  } = useCart();

  const deliveryCharge =
    totalAmount >= 500 || totalAmount === 0 ? 0 : 50;

  const gst = Number((totalAmount * 0.05).toFixed(2));

  const grandTotal =
    totalAmount + deliveryCharge + gst;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Order Summary
      </h2>

      {/* Product List */}

      <div className="space-y-4 max-h-72 overflow-y-auto">

        {cart.map((item) => (

          <div
            key={item.id}
            className="flex items-center gap-4 border-b pb-4"
          >

            <img
              src={`/images/products/${item.product_image}`}
              alt={item.product_name}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = "/images/no-image.png";
              }}
            />

            <div className="flex-1">

              <h3 className="font-semibold">
                {item.product_name}
              </h3>

              <p className="text-sm text-gray-500">
                Qty : {item.quantity}
              </p>

            </div>

            <div className="font-bold text-green-700">
              ₹{item.price * item.quantity}
            </div>

          </div>

        ))}

      </div>

      <hr className="my-6" />

      {/* Price Details */}

      <div className="space-y-3">

        <div className="flex justify-between">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">

          <span>Delivery Charge</span>

          <span
            className={
              deliveryCharge === 0
                ? "text-green-600 font-semibold"
                : ""
            }
          >
            {deliveryCharge === 0
              ? "FREE"
              : `₹${deliveryCharge}`}
          </span>

        </div>

        <div className="flex justify-between">
          <span>GST (5%)</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>

      </div>

      <hr className="my-6" />

      <div className="flex justify-between text-2xl font-bold">

        <span>Total</span>

        <span className="text-green-700">
          ₹{grandTotal.toFixed(2)}
        </span>

      </div>

      <button
        onClick={() => {
  navigate("/order-success");
}}
        className="w-full mt-8 bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl text-lg font-semibold transition"
      >
        Place Order
      </button>

    </div>
  );
}

export default OrderSummary;