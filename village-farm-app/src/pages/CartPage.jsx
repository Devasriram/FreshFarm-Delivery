import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function CartPage() {
  const navigate = useNavigate();

  const {
    cart,
    loading,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    totalItems,
    totalAmount,
  } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl">
        Loading Cart...
      </div>
    );
  }

  const deliveryCharge =
    totalAmount >= 500 || totalAmount === 0 ? 0 : 50;

  const grandTotal = totalAmount + deliveryCharge;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">

        <ShoppingCart
          size={90}
          className="text-green-700"
        />

        <h2 className="text-3xl font-bold mt-5">
          Your Cart is Empty
        </h2>

        <p className="text-gray-500 mt-2">
          Add fresh farm products to continue shopping.
        </p>

        <Link
          to="/home"
          className="mt-8 bg-green-700 text-white px-8 py-3 rounded-xl"
        >
          Continue Shopping
        </Link>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-green-50 py-10">

      <div className="max-w-7xl mx-auto px-6">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-green-700"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* Cart Items */}

          <div className="lg:col-span-2 space-y-6">

            {cart.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row gap-5"
              >

                <img
                  src={`/images/products/${item.product.product_image}`}
                  alt={item.product.product_name}
                  className="w-36 h-36 rounded-xl object-cover"
                  onError={(e) => {
                    e.target.src = "/images/no-image.png";
                  }}
                />

                <div className="flex-1">

                  <h2 className="text-2xl font-bold">
                    {item.product.product_name}
                  </h2>

                  <p className="text-green-700 text-xl mt-2">
                    ₹{item.product.price}

                    <span className="text-gray-500">
                      {" "}
                      / {item.product.unit}
                    </span>

                  </p>

                  <div className="flex items-center gap-4 mt-6">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id,
                          item.quantity
                        )
                      }
                      className="bg-gray-200 p-2 rounded-full"
                    >
                      <Minus size={18} />
                    </button>

                    <span className="text-xl font-bold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id,
                          item.quantity
                        )
                      }
                      className="bg-gray-200 p-2 rounded-full"
                    >
                      <Plus size={18} />
                    </button>

                  </div>

                  <p className="mt-6 text-lg font-semibold">
                    Subtotal :
                    ₹
                    {(item.product.price * item.quantity).toFixed(2)}
                  </p>

                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600"
                >
                  <Trash2 />
                </button>

              </div>

            ))}

          </div>

          {/* Summary */}

          <div>

            <div className="bg-white rounded-2xl shadow p-8 sticky top-6">

              <h2 className="text-2xl font-bold">
                Cart Summary
              </h2>

              <div className="space-y-4 mt-6">

                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>
                    {deliveryCharge === 0
                      ? "FREE"
                      : `₹${deliveryCharge}`}
                  </span>
                </div>

                <hr />

                <div className="flex justify-between text-2xl font-bold">

                  <span>Total</span>

                  <span>
                    ₹{grandTotal.toFixed(2)}
                  </span>

                </div>

              </div>

              <Link
                to="/home"
                className="block w-full text-center mt-8 border border-green-700 text-green-700 py-3 rounded-xl"
              >
                Continue Shopping
              </Link>

              <Link
                to="/checkout"
                className="block w-full text-center mt-4 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl"
              >
                Proceed to Checkout
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default CartPage;