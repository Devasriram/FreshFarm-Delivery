import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [deliveryPartners, setDeliveryPartners] = useState([]);

  const [status, setStatus] = useState("");

  const [partnerId, setPartnerId] = useState("");

  useEffect(() => {
    loadOrder();
    loadDeliveryPartners();
  }, []);

  const loadOrder = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/admin/orders/${id}`
      );

      setOrder(res.data);
      setStatus(res.data.order_status);

      if (res.data.delivery_partner_id) {
        setPartnerId(res.data.delivery_partner_id);
      }

    } catch (err) {
      console.error(err);
      alert("Unable to load order.");
    } finally {
      setLoading(false);
    }
  };

  const loadDeliveryPartners = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/admin/delivery"
      );

      setDeliveryPartners(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async () => {
    try {

      await axios.patch(
        `http://127.0.0.1:8000/admin/orders/${id}/status`,
        {
          status: status,
        }
      );

      alert("Order status updated.");

      loadOrder();

    } catch (err) {
      console.error(err);
      alert("Unable to update status.");
    }
  };

  const assignPartner = async () => {
    try {

      await axios.patch(
        `http://127.0.0.1:8000/admin/orders/${id}/assign`,
        {
          delivery_partner_id: partnerId,
        }
      );

      alert("Delivery Partner Assigned");

      loadOrder();

    } catch (err) {
      console.error(err);
      alert("Unable to assign partner.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lg">
        Loading Order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">

        <h2 className="text-2xl font-bold mb-5">
          Order not found
        </h2>

        <button
          onClick={() => navigate("/admin/orders")}
          className="bg-green-600 text-white px-5 py-2 rounded"
        >
          Back
        </button>

      </div>
    );
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Order Details
        </h1>

        <button
          onClick={() => navigate("/admin/orders")}
          className="bg-gray-700 text-white px-5 py-2 rounded"
        >
          Back
        </button>

      </div>

      {/* Customer */}

      <div className="bg-white shadow rounded p-6 mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Customer Information
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <strong>Name:</strong> {order.customer_name}
          </div>

          <div>
            <strong>Mobile:</strong> {order.mobile_number}
          </div>

          <div>
            <strong>Email:</strong> {order.email}
          </div>

          <div>
            <strong>Village:</strong> {order.village}
          </div>

        </div>

      </div>

      {/* Order */}

      <div className="bg-white shadow rounded p-6 mb-6">

        <h2 className="text-xl font-semibold mb-5">
          Order Information
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">

          <div>
            <strong>Order No:</strong> {order.order_number}
          </div>

          <div>
            <strong>Total:</strong> ₹{order.grand_total}
          </div>

          <div>
            <strong>Payment:</strong> {order.payment_method}
          </div>

          <div>
            <strong>Payment Status:</strong> {order.payment_status}
          </div>

          <div>
            <strong>Date:</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
          </div>

        </div>

        {/* Update Status */}

        <div className="flex gap-3 items-center mb-5">

          <label className="font-semibold">
            Order Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Preparing</option>
            <option>Out for Delivery</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>

          <button
            onClick={updateStatus}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Status
          </button>

        </div>

        {/* Assign Delivery */}

        <div className="flex gap-3 items-center">

          <label className="font-semibold">
            Delivery Partner
          </label>

          <select
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">
              Select Partner
            </option>

            {deliveryPartners.map((partner) => (

              <option
                key={partner.id}
                value={partner.id}
              >
                {partner.partner_name}
              </option>

            ))}

          </select>

          <button
            onClick={assignPartner}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Assign
          </button>

        </div>

      </div>

      {/* Products */}

      <div className="bg-white shadow rounded overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">
                Product
              </th>

              <th className="p-3">
                Price
              </th>

              <th className="p-3">
                Qty
              </th>

              <th className="p-3">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {order.items?.map((item) => (

              <tr
                key={item.id}
                className="border-t"
              >

                <td className="p-3">
                  {item.product_name}
                </td>

                <td className="text-center">
                  ₹{item.price}
                </td>

                <td className="text-center">
                  {item.quantity}
                </td>

                <td className="text-center">
                  ₹{item.total}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default OrderDetails;