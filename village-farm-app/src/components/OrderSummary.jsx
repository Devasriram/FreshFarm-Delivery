import { useCart } from "../context/CartContext";

function OrderSummary({
  handlePlaceOrder,
  placingOrder,
}) {
  const { cart } = useCart();

  const itemTotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.product?.price || 0) * item.quantity,
    0
  );

  const deliveryCharge =
    itemTotal >= 500 ? 0 : 40;

  const discount = 0;

  const grandTotal =
    itemTotal +
    deliveryCharge -
    discount;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Order Summary
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Your cart is empty.
        </div>
      ) : (
        <>
          <div className="space-y-5">

            {cart.map((item) => {

              const price = Number(
                item.product?.price || 0
              );
              return (

                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-4"
                >

                  <div className="flex items-center gap-4">

                    {item.product?.product_image ? (
                      <img
                       src={`/images/products/${item.product.product_image}`}
                       alt={item.product.product_name}
                       className="w-16 h-16 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        📦
                      </div>
                    )}

                    <div>

                      <h3 className="font-semibold text-gray-800">
                        {item.product?.product_name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        ₹{price.toFixed(2)} × {item.quantity}
                      </p>

                    </div>

                  </div>

                  <div className="font-semibold text-green-700">

                    ₹{(price * item.quantity).toFixed(2)}

                  </div>

                </div>

              );

            })}

          </div>

          <div className="border-t mt-6 pt-5 space-y-3">

            <div className="flex justify-between">

              <span className="text-gray-600">
                Item Total
              </span>

              <span className="font-medium">
                ₹{itemTotal.toFixed(2)}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-600">
                Delivery Charge
              </span>

              <span
                className={
                  deliveryCharge === 0
                    ? "text-green-600 font-semibold"
                    : "font-medium"
                }
              >
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${deliveryCharge}`}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-600">
                Discount
              </span>

              <span className="text-green-600">
                -₹{discount.toFixed(2)}
              </span>

            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">

              <span>Grand Total</span>

              <span className="text-green-700">
                ₹{grandTotal.toFixed(2)}
              </span>

            </div>

          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={
              placingOrder ||
              cart.length === 0
            }
            className="mt-8 w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-xl font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {placingOrder
              ? "Placing Order..."
              : "Place Order"}
          </button>
        </>
      )}

    </div>
  );
}

export default OrderSummary;