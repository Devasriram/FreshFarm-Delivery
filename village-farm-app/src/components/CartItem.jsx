import {
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function CartItem({ item }) {

  const {
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">

      <div className="flex flex-col md:flex-row gap-6">

        {/* Product Image */}

        <div className="md:w-40">

          <img
            src={`/images/products/${item.product_image}`}
            alt={item.product_name}
            className="w-full h-36 object-cover rounded-xl"
            onError={(e) => {
              e.target.src = "/images/no-image.png";
            }}
          />

        </div>

        {/* Product Details */}

        <div className="flex-1">

          <h2 className="text-2xl font-bold text-gray-800">
            {item.product_name}
          </h2>

          <p className="text-gray-600 mt-2">
            {item.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-6">

            <span className="text-green-700 text-2xl font-bold">
              ₹{item.price}
            </span>

            <span className="text-gray-500">
              / {item.unit}
            </span>

          </div>

          {/* Quantity Controls */}

          <div className="mt-6 flex items-center gap-4">

            <button
              onClick={() => decreaseQuantity(item.id)}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex justify-center items-center"
            >
              <Minus size={18} />
            </button>

            <span className="text-xl font-bold w-8 text-center">
              {item.quantity}
            </span>

            <button
              onClick={() => increaseQuantity(item.id)}
              className="w-10 h-10 rounded-full bg-green-700 text-white hover:bg-green-800 flex justify-center items-center"
            >
              <Plus size={18} />
            </button>

          </div>

        </div>

        {/* Total + Remove */}

        <div className="flex flex-col justify-between items-end">

          <button
            onClick={() => removeItem(item.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={24} />
          </button>

          <div className="text-right">

            <p className="text-gray-500">
              Total
            </p>

            <h2 className="text-2xl font-bold text-green-700">
              ₹{item.price * item.quantity}
            </h2>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CartItem;