import { useEffect, useState } from "react";
import {
  getCustomers,
  toggleCustomerStatus,
} from "../services/customerService";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);

    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading Customers...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Customer Management
      </h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Email</th>
              <th className="p-3">Village</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t">
                <td className="p-3">
                  {customer.customer_name}
                </td>

                <td className="p-3">
                  {customer.mobile_number}
                </td>

                <td className="p-3">
                  {customer.email}
                </td>

                <td className="p-3">
                  {customer.village}
                </td>

                <td className="p-3">
                  {customer.total_orders}
                </td>

                <td className="p-3">
                  <button
                    onClick={async () => {
                      await toggleCustomerStatus(customer.id);
                      loadCustomers();
                    }}
                    className={`px-3 py-1 rounded ${
                      customer.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {customer.status ? "Enabled" : "Disabled"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;