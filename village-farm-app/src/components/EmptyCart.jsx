import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center justify-center">

      {/* Cart Icon */}
      <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center">
        <ShoppingCart
          size={60}
          className="text-green-700"
        />
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-800 mt-8">
        Your Cart is Empty
      </h2>

      {/* Description */}
      <p className="text-gray-500 text-center mt-4 max-w-md">
        Looks like you haven't added any products yet.
        Browse our fresh farm products and add your favorites
        to the cart.
      </p>

      {/* Continue Shopping */}
      <button
        onClick={() => navigate("/home")}
        className="mt-8 bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
      >
        Continue Shopping
      </button>

    </div>
  );
}

export default EmptyCart;