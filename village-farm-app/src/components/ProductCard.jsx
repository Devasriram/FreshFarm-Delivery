import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    try {
      setAdding(true);

      await addToCart(product);

      alert("Product added to cart successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition duration-300">

      {/* Product Image */}
      <div className="relative overflow-hidden">

        <img
          src={`/images/products/${product.product_image}`}
          alt={product.product_name}
          className="w-full h-60 object-cover hover:scale-105 transition duration-500"
          onError={(e) => {
            e.target.src = "/images/no-image.png";
          }}
        />

        {product.stock > 0 ? (
          <span className="absolute top-3 right-3 bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
            In Stock
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
            Out of Stock
          </span>
        )}

      </div>

      {/* Product Details */}
      <div className="p-5">

        <h2 className="text-xl font-bold text-gray-800">
          {product.product_name}
        </h2>

        <p className="text-gray-600 mt-2 h-12 overflow-hidden">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-4">

          <span className="text-2xl font-bold text-green-700">
            ₹{product.price}
          </span>

          <span className="text-gray-500">
            / {product.unit}
          </span>

        </div>

        <p className="text-sm text-gray-500 mt-2">
          Available Stock : {product.stock}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-5">

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || adding}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              product.stock > 0
                ? "bg-green-700 hover:bg-green-800 text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>

          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex-1 border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white py-3 rounded-xl font-semibold transition"
          >
            View Details
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;