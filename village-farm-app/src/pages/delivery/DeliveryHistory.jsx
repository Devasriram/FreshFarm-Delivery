import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Phone,
  Search,
  ArrowUpDown,
  ShoppingBag,
} from "lucide-react";
import { getDeliveryHistory } from "../../services/deliveryPortalService";

function DeliveryHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getDeliveryHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.order_number.toLowerCase().includes(term) ||
      item.customer_name.toLowerCase().includes(term) ||
      item.village.toLowerCase().includes(term)
    );
  });

  const totalDeliveredSum = history.reduce(
    (sum, order) => sum + (order.grand_total || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Delivery History ({history.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete record of your fulfilled village fresh orders
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2 rounded-xl flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <div className="text-xs">
            <span className="text-slate-500">Total Value Delivered: </span>
            <strong className="text-sm text-emerald-800">
              ₹{totalDeliveredSum.toFixed(2)}
            </strong>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by order number, customer name or village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* History Table / Cards */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Calendar size={28} />
          </div>
          <h3 className="font-semibold text-slate-800 text-base">
            No Delivered Orders Found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Completed deliveries will be listed here with timestamps and details.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer & Contact</th>
                  <th className="p-3.5">Address</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Delivered On</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => (
                  <tr key={item.order_id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">
                      #{item.order_number}
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">
                        {item.customer_name}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {item.mobile_number}
                      </div>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <div className="truncate" title={item.full_address}>
                        {item.door_street}, {item.village}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-medium text-slate-800">
                        {item.payment_method}
                      </span>
                      <span className="block text-[10px] text-emerald-600 font-bold">
                        {item.payment_status}
                      </span>
                    </td>

                    <td className="p-3.5 font-black text-emerald-700 text-sm">
                      ₹{item.grand_total.toFixed(2)}
                    </td>

                    <td className="p-3.5 text-slate-500">
                      {item.delivered_at
                        ? new Date(item.delivered_at).toLocaleString()
                        : new Date(item.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                        <CheckCircle2 size={12} />
                        Delivered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryHistory;
