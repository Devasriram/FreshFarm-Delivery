import Header from "../components/Header";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import EmptyCart from "../components/EmptyCart";

import { useCart } from "../context/CartContext";

function CartPage() {
  const { cart } = useCart();

  return (
    <div className="min-h-screen bg-green-50">

      <Header />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Cart Items */}

            <div className="lg:col-span-2 space-y-6">

              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                />
              ))}

            </div>

            {/* Order Summary */}

            <div>

              <CartSummary />

            </div>

          </div>
        )}

      </div>

      <Footer />

    </div>
  );
}

export default CartPage;