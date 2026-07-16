import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import OrderItemCard from "../components/OrderItemCard";
import OrderStatusBadge from "../components/OrderStatusBadge";

import { getOrderById } from "../services/orderService";

function OrderDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    loadOrder();

  }, [id]);

  const loadOrder = async () => {

    try {

      const data = await getOrderById(id);

      setOrder(data);

    } catch (err) {

      console.error(err);

      setError("Unable to load order.");

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <div className="min-h-screen flex justify-center items-center">

        Loading Order...

      </div>

    );

  }

  if (error) {

    return (

      <div className="min-h-screen flex justify-center items-center text-red-600">

        {error}

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-green-50">

      <Header />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <button
          onClick={() => navigate("/orders")}
          className="mb-6 bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800"
        >
          ← Back to Orders
        </button>

        <div className="bg-white rounded-2xl shadow-md p-8">

          <div className="flex flex-col lg:flex-row justify-between gap-6">

            <div>

              <h2 className="text-3xl font-bold">

                {order.order_number}

              </h2>

              <p className="text-gray-500 mt-2">

                {new Date(order.created_at).toLocaleString()}

              </p>

            </div>

            <div className="space-y-3">

              <OrderStatusBadge

                status={order.order_status}

                type="order"

              />

              <OrderStatusBadge

                status={order.payment_status}

                type="payment"

              />

            </div>

          </div>

          <hr className="my-8"/>

          <h3 className="text-2xl font-bold mb-5">

            Delivery Address

          </h3>

          <div className="grid md:grid-cols-2 gap-3">

            <p><b>Name :</b> {order.full_name}</p>

            <p><b>Mobile :</b> {order.mobile}</p>

            <p><b>Email :</b> {order.email}</p>

            <p><b>Village :</b> {order.village}</p>

            <p><b>City :</b> {order.city}</p>

            <p><b>District :</b> {order.district}</p>

            <p><b>State :</b> {order.state}</p>

            <p><b>Pincode :</b> {order.pincode}</p>

            <p className="md:col-span-2">

              <b>Address :</b>

              {order.house_no},

              {order.street}

            </p>

          </div>

          <hr className="my-8"/>

          <h3 className="text-2xl font-bold mb-6">

            Ordered Products

          </h3>

          <div className="space-y-5">

            {order.items.map((item)=>(

              <OrderItemCard

                key={item.id}

                item={item}

              />

            ))}

          </div>

          <hr className="my-8"/>

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <h3 className="font-semibold">

                Payment Method

              </h3>

              <p>{order.payment_method}</p>

            </div>

            <div className="text-right">

              <h2 className="text-3xl font-bold text-green-700">

                ₹{order.grand_total}

              </h2>

            </div>

          </div>

        </div>

      </div>

      <Footer />

    </div>

  );

}

export default OrderDetails;