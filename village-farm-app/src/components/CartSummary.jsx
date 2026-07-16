import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartSummary() {
  const navigate = useNavigate();

  const {
    cart,
    totalItems,
    totalAmount,
  } = useCart();

  const deliveryCharge =
    totalAmount >= 500 || totalAmount === 0 ? 0 : 50;

  const gst = Number((totalAmount * 0.05).toFixed(2));

  const grandTotal = totalAmount + deliveryCharge + gst;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Order Summary
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Total Products</span>
          <span>{cart.length}</span>
        </div>

        <div className="flex justify-between">
          <span>Total Quantity</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between">
          <span>Sub Total</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Charge</span>

          <span className={deliveryCharge === 0 ? "text-green-600 font-semibold" : ""}>
            {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span>GST (5%)</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>

        <hr />

        <div className="flex justify-between text-2xl font-bold text-green-700">
          <span>Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>

      </div>

      <button
        onClick={() => navigate("/checkout")}
        disabled={cart.length === 0}
        className={`w-full mt-8 py-4 rounded-xl text-lg font-semibold transition ${
          cart.length === 0
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-green-700 hover:bg-green-800 text-white"
        }`}
      >
        Proceed to Checkout
      </button>

      <button
        onClick={() => navigate("/home")}
        className="w-full mt-3 border border-green-700 text-green-700 hover:bg-green-50 py-4 rounded-xl font-semibold"
      >
        Continue Shopping
      </button>

      <div className="mt-6 text-sm text-gray-500">
        <p>• Free delivery on orders above ₹500</p>
        <p>• Fresh products delivered to your doorstep</p>
        <p>• Secure checkout</p>
      </div>

    </div>
  );
}

export default CartSummary;