import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../services/orderService";
import {
  Search,
  Eye,
  FileText,
  XCircle,
  Package,
  Calendar,
  ChevronRight,
  RotateCcw,
  Download,
} from "lucide-react";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
  const filteredOrders = orders.filter((order) => {
  const firstItem = order.items?.[0];

  const searchMatch =
    order.order_number
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    firstItem?.product?.product_name
      ?.toLowerCase()
      .includes(search.toLowerCase());

  let filterMatch = true;

  if (filter === "Delivered") {
    filterMatch = order.order_status === "Delivered";
  } else if (filter === "Cancelled") {
    filterMatch = order.order_status === "Cancelled";
  } else if (filter === "In Progress") {
    filterMatch =
      order.order_status !== "Delivered" &&
      order.order_status !== "Cancelled";
  }

  return searchMatch && filterMatch;
});
  if (loading) {
    return (
      <div className="text-center mt-10 text-lg">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">
          No Orders Found
        </h2>
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gray-100 py-8">

    <div className="max-w-7xl mx-auto px-4">

      {/* Page Title */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            My Orders
          </h1>

          <p className="text-gray-500 mt-1">
            Track and manage your orders
          </p>

        </div>

        <div className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold">
          {orders.length} Orders
        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow p-5 mb-6">

        <div className="relative">

          <Search
            className="absolute left-4 top-3.5 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search by Order Number or Product..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border rounded-lg py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-500"
          />

        </div>

      </div>

      {/* Filter Buttons */}

      <div className="flex flex-wrap gap-3 mb-8">

        {[
          "All",
          "In Progress",
          "Delivered",
          "Cancelled",
        ].map((status) => (

          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 rounded-full font-medium transition
            ${
              filter === status
                ? "bg-green-600 text-white"
                : "bg-white shadow hover:bg-green-50"
            }`}
          >
            {status}
          </button>

        ))}

      </div>

      {/* Orders */}

      <div className="space-y-6">

        {filteredOrders.length === 0 && (

          <div className="bg-white rounded-xl shadow p-12 text-center">

            <h2 className="text-2xl font-bold">
              No Orders Found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or filter.
            </p>

          </div>

        )}

        {filteredOrders.map((order) => {

          const firstItem = order.items?.[0];

          return (

            <div
              key={order.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
            >

              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">

                {/* Left */}
                <div className="flex gap-5">
                
                    <img
                        src={
                        firstItem?.product?.product_image
                         ? `/images/products/${firstItem.product.product_image}`
                         : "https://placehold.co/120x120"
                    }
                        alt={firstItem?.product?.product_name}
                        className="w-28 h-28 rounded-lg object-cover border"
                        onError={(e) => {
                        e.target.src = "https://placehold.co/120x120";
                    }}
                    />
                  <div>

                    <h2 className="text-xl font-bold">

                      {firstItem?.product?.product_name}

                    </h2>

                    <p className="text-gray-500 mt-1">

                      Order #

                      {" "}

                      {order.order_number}

                    </p>

                    <p className="text-gray-500">

                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}

                    </p>

                    <p className="mt-2 font-semibold">

                      Qty :

                      {" "}

                      {firstItem?.quantity}

                    </p>

                    <p className="text-green-700 font-bold text-lg">

                      ₹{order.grand_total}

                    </p>

                  </div>

                </div>

                {/* Right */}

                <div className="mt-6 lg:mt-0 flex flex-col items-end gap-4">

                  <span
                    className={`px-4 py-2 rounded-full font-semibold
                    ${
                      order.order_status === "Delivered"
                        ? "bg-green-100 text-green-700"

                        : order.order_status === "Cancelled"
                        ? "bg-red-100 text-red-700"

                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.order_status}
                  </span>

                  <div className="text-gray-600">

                    Payment :

                    {" "}

                    {order.payment_method}

                  </div>

                  <div className="flex gap-3">

                    <Link
                      to={`/my-orders/${order.id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                    >
                      View Details
                    </Link>

                    {order.order_status ===
                      "Delivered" && (

                      <button
                        className="border border-green-600 text-green-600 hover:bg-green-50 px-5 py-2 rounded-lg"
                      >
                        Reorder
                      </button>

                    )}

                  </div>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  </div>
);
}

export default MyOrders;
