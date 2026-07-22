import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
} from "lucide-react";

import {
  getProductById,
  getRelatedProducts,
} from "../services/productService";

import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const p = await getProductById(id);

        setProduct(p);
        setSelectedImage(p.product_image || "");

        try {
          const r = await getRelatedProducts(id);
          setRelatedProducts(r);
        } catch (err) {
          console.error(err);
        }

      } catch (err) {
        console.error(err);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const images = useMemo(() => {
    if (!product) return [];

    const imgs = [];

    if (product.product_image) {
      imgs.push(product.product_image);
    }

    if (product.additional_images) {
      imgs.push(
        ...product.additional_images
          .split(",")
          .map((img) => img.trim())
          .filter(Boolean)
      );
    }

    return [...new Set(imgs)];
  }, [product]);

  const increaseQty = () => {
    setQuantity((q) => Math.min(q + 1, product.stock));
  };

  const decreaseQty = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleAddToCart = async () => {
    try {
      setAdding(true);

      await addToCart({
        ...product,
        quantity,
      });

      alert("Product added to cart successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setAdding(true);

      await addToCart({
        ...product,
        quantity,
      });

      navigate("/cart");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-8">

      <div className="max-w-7xl mx-auto px-6">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-lg grid lg:grid-cols-2 gap-10 p-8">

          {/* Images */}

          <div>

            <img
              src={`/images/products/${selectedImage}`}
              alt={product.product_name}
              className="w-full h-[480px] object-cover rounded-2xl"
              onError={(e) => {
                e.target.src = "/images/no-image.png";
              }}
            />

            <div className="flex gap-3 mt-4 flex-wrap">

              {images.map((img) => (

                <img
                  key={img}
                  src={`/images/products/${img}`}
                  alt=""
                  onClick={() => setSelectedImage(img)}
                  className="w-20 h-20 rounded-lg border cursor-pointer object-cover"
                />

              ))}

            </div>

          </div>

          {/* Details */}

          <div>

            <h1 className="text-4xl font-bold">
              {product.product_name}
            </h1>

            <p className="mt-2 text-gray-500">
              Category ID : {product.category_id}
            </p>

            <div className="mt-5 text-4xl font-bold text-green-700">
              ₹{product.price}

              <span className="text-xl text-gray-500 ml-2">
                / {product.unit}
              </span>

            </div>

            <div className="mt-4">

              {product.stock > 0 ? (

                <span className="bg-green-600 text-white px-3 py-2 rounded-full">
                  In Stock ({product.stock})
                </span>

              ) : (

                <span className="bg-red-600 text-white px-3 py-2 rounded-full">
                  Out of Stock
                </span>

              )}

            </div>

            <p className="mt-6 text-gray-700">
              {product.description}
            </p>

            <div className="mt-6 space-y-2">

              <p>
                <strong>Freshness :</strong>{" "}
                {product.freshness_info || "Freshly packed today"}
              </p>

              <p>
                <strong>Delivery :</strong>{" "}
                {product.delivery_available === false
                  ? "Unavailable"
                  : "Available"}
              </p>

            </div>

            <div className="mt-8 flex items-center gap-4">

              <button
                onClick={decreaseQty}
                className="p-2 rounded bg-gray-200"
              >
                <Minus />
              </button>

              <span className="text-2xl font-bold">
                {quantity}
              </span>

              <button
                onClick={increaseQty}
                className="p-2 rounded bg-gray-200"
              >
                <Plus />
              </button>

            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">

              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock <= 0}
                className="bg-green-700 hover:bg-green-800 text-white rounded-xl py-3 flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                <ShoppingCart size={18} />

                {adding ? "Adding..." : "Add to Cart"}

              </button>

              <button
                onClick={handleBuyNow}
                disabled={adding || product.stock <= 0}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                <Zap size={18} />

                Buy Now

              </button>

            </div>

          </div>

        </div>

        {/* Related Products */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-5">
            Related Products
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            {relatedProducts.map((item) => (

              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="bg-white rounded-xl shadow cursor-pointer overflow-hidden"
              >

                <img
                  src={`/images/products/${item.product_image}`}
                  alt={item.product_name}
                  className="h-44 w-full object-cover"
                />

                <div className="p-4">

                  <h3 className="font-semibold">
                    {item.product_name}
                  </h3>

                  <p className="text-green-700 font-bold mt-2">
                    ₹{item.price}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}