import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getOrders,
  updateOrderStatus,
} from "../services/orderService";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch (err) {
      alert("Failed to update order status.");
    }
  };

  if (loading) {
    return (
      <div className="text-lg">
        Loading Orders...
      </div>
    );
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Order Management
        </h1>

      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3">Order ID</th>

              <th className="p-3">Customer</th>

              <th className="p-3">Amount</th>

              <th className="p-3">Payment</th>

              <th className="p-3">Status</th>

              <th className="p-3">Date</th>

              <th className="p-3">Actions</th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (

              <tr
                key={order.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-3">
                  {order.order_number}
                </td>

                <td className="p-3">
                  {order.customer_name}
                </td>

                <td className="p-3">
                  ₹{order.total_amount}
                </td>

                <td className="p-3">
                  {order.payment_method}
                </td>

                <td className="p-3">

                  <select
                    value={order.order_status}
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value
                      )
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Preparing</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>

                </td>

                <td className="p-3">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>

                <td className="p-3">

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        navigate(`/admin/orders/${order.id}`)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/admin/orders/${order.id}`)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Manage
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Orders;