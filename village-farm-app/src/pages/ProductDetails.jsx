import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load product.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-semibold">
          Loading Product...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-red-600 text-xl">
          {error}
        </h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-xl">
          Product not found.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-10">

      <div className="max-w-7xl mx-auto px-6">

        {/* Back Button */}

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-green-700 hover:text-green-900"
        >
          <ArrowLeft size={22} />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          <div className="grid lg:grid-cols-2 gap-10">

            {/* Product Image */}

            <div className="p-8">

              <img
                src={`/images/products/${product.product_image}`}
                alt={product.product_name}
                className="w-full h-[500px] object-cover rounded-2xl"
                onError={(e) => {
                  e.target.src = "/images/no-image.png";
                }}
              />

            </div>

            {/* Product Details */}

            <div className="p-10">

              <h1 className="text-4xl font-bold text-gray-800">
                {product.product_name}
              </h1>

              <p className="mt-6 text-gray-600 leading-8 text-lg">
                {product.description}
              </p>

              <div className="mt-8">

                <span className="text-4xl font-bold text-green-700">
                  ₹{product.price}
                </span>

                <span className="text-xl text-gray-500 ml-3">
                  / {product.unit}
                </span>

              </div>

              <div className="mt-6">

                {product.stock > 0 ? (
                  <span className="bg-green-600 text-white px-4 py-2 rounded-full">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="bg-red-600 text-white px-4 py-2 rounded-full">
                    Out of Stock
                  </span>
                )}

              </div>

              <div className="mt-10">

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className={`w-full py-4 rounded-xl text-lg font-semibold transition ${
                    product.stock > 0
                      ? "bg-green-700 hover:bg-green-800 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Add to Cart
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;