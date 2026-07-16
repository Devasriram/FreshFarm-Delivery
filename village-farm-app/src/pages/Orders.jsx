import { useEffect, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import OrderCard from "../components/OrderCard";

import { getOrders } from "../services/orderService";

function Orders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    loadOrders();

  }, []);

  const loadOrders = async () => {

    try {

      const data = await getOrders();

      setOrders(data);

    }

    catch (err) {

      console.error(err);

      setError("Unable to load your orders.");

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-green-50">

      <Header />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold text-gray-800 mb-8">

          My Orders

        </h1>

        {loading && (

          <div className="text-center py-10">

            Loading Orders...

          </div>

        )}

        {error && (

          <div className="text-red-600 text-center">

            {error}

          </div>

        )}

        {!loading && !error && orders.length === 0 && (

          <div className="bg-white rounded-2xl shadow-md p-10 text-center">

            <h2 className="text-2xl font-bold">

              No Orders Found

            </h2>

            <p className="text-gray-500 mt-3">

              Start shopping to place your first order.

            </p>

          </div>

        )}

        {!loading && !error && orders.length > 0 && (

          <div className="space-y-6">

            {orders.map((order) => (

              <OrderCard

                key={order.id}

                order={order}

              />

            ))}

          </div>

        )}

      </div>

      <Footer />

    </div>

  );

}

export default Orders;