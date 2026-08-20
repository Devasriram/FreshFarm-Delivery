import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOrders, reorderOrder } from "../services/orderService";
import {
  Search,
  Package,
  Calendar,
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [reorderingId, setReorderingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderId) => {
    try {
      setReorderingId(orderId);
      await reorderOrder(orderId);
      navigate("/cart");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to reorder items.");
    } finally {
      setReorderingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const term = search.toLowerCase();
    const matchesOrderNo = order.order_number?.toLowerCase().includes(term);
    const matchesProduct = order.items?.some((i) =>
      i.product?.product_name?.toLowerCase().includes(term)
    );
    const searchMatch = !search || matchesOrderNo || matchesProduct;

    let filterMatch = true;
    if (filter === "Delivered") {
      filterMatch = order.order_status === "Delivered";
    } else if (filter === "Cancelled") {
      filterMatch = order.order_status === "Cancelled";
    } else if (filter === "In Progress") {
      filterMatch = !["Delivered", "Cancelled"].includes(order.order_status);
    }

    return searchMatch && filterMatch;
  });

  const deliveredCount = orders.filter((o) => o.order_status === "Delivered").length;
  const inProgressCount = orders.filter((o) => !["Delivered", "Cancelled"].includes(o.order_status)).length;
  const cancelledCount = orders.filter((o) => o.order_status === "Cancelled").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              My Orders & History
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track live deliveries, view past orders, and easily reorder fresh farm products
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold self-start sm:self-auto flex items-center gap-2">
            <ShoppingBag size={15} className="text-emerald-700" />
            <span>Total Orders: {orders.length}</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 space-y-4">
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Order ID or Product Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: "All", label: "All Orders", count: orders.length },
              { id: "In Progress", label: "In Progress", count: inProgressCount },
              { id: "Delivered", label: "Delivered", count: deliveredCount },
              { id: "Cancelled", label: "Cancelled", count: cancelledCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                  filter === tab.id
                    ? "bg-slate-900 text-white shadow"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    filter === tab.id
                      ? "bg-slate-800 text-slate-200"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Package size={28} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No Orders Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any orders matching your selected filter or search keyword.
            </p>
            <Link
              to="/home"
              className="mt-5 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-md transition"
            >
              Explore Fresh Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isDelivered = order.order_status === "Delivered";
              const isCancelled = order.order_status === "Cancelled";
              const isReordering = reorderingId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-md transition"
                >
                  {/* Order Card Header */}
                  <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
                        #{order.order_number?.slice(-4)}
                      </div>
                      <div>
                        <div className="font-bold text-sm">
                          Order #{order.order_number}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          isDelivered
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                            : isCancelled
                            ? "bg-red-500/20 text-red-300 border border-red-400/30"
                            : "bg-amber-400 text-slate-900"
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </div>
                  </div>

                  {/* Order Card Content */}
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Products Thumbnail Strip */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex -space-x-3 overflow-hidden shrink-0">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={
                              item.product?.product_image
                                ? `/images/products/${item.product.product_image}`
                                : "https://placehold.co/80x80"
                            }
                            alt={item.product?.product_name || "Product"}
                            className="inline-block h-14 w-14 rounded-xl object-cover ring-2 ring-white border border-slate-200"
                            onError={(e) => {
                              e.target.src = "https://placehold.co/80x80";
                            }}
                          />
                        ))}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-slate-900">
                          {order.items?.[0]?.product?.product_name || "Farm Products"}
                          {order.items?.length > 1 && (
                            <span className="text-slate-500 font-normal text-xs ml-1">
                              + {order.items.length - 1} more item(s)
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span>Pay: <strong className="text-slate-700 uppercase">{order.payment_method}</strong></span>
                          <span>•</span>
                          <span className={order.payment_status === "Paid" ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                            {order.payment_status}
                          </span>
                        </div>

                        {order.estimated_delivery_time && !isDelivered && !isCancelled && (
                          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                            <Clock size={12} />
                            <span>Est: {order.estimated_delivery_time}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      <div className="text-left md:text-right">
                        <div className="text-[11px] text-slate-400 font-medium">Total Amount</div>
                        <div className="text-xl font-black text-emerald-700">
                          ₹{order.grand_total}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/my-orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
                        >
                          <span>Track Order</span>
                          <ArrowRight size={14} />
                        </Link>

                        {(isDelivered || isCancelled) && (
                          <button
                            onClick={() => handleReorder(order.id)}
                            disabled={isReordering}
                            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs transition border border-slate-200 disabled:opacity-50"
                          >
                            <RotateCcw size={13} />
                            <span>{isReordering ? "..." : "Reorder"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
