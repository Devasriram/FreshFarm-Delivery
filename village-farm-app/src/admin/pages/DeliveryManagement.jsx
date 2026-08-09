import { useEffect, useState } from "react";

import {
  getDeliveryPartners,
  createDeliveryPartner,
  togglePartnerStatus,
} from "../services/deliveryService";

function DeliveryManagement() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    partner_name: "",
    mobile_number: "",
    vehicle_number: "",
    village: "",
  });

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const data = await getDeliveryPartners();
      setPartners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createDeliveryPartner(formData);

      setFormData({
        partner_name: "",
        mobile_number: "",
        vehicle_number: "",
        village: "",
      });

      loadPartners();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create partner.");
    }
  };

  if (loading) {
    return <p className="text-lg">Loading...</p>;
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Delivery Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-5 mb-6 grid md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          placeholder="Partner Name"
          value={formData.partner_name}
          onChange={(e) =>
            setFormData({
              ...formData,
              partner_name: e.target.value,
            })
          }
          className="border rounded p-2"
          required
        />

        <input
          type="text"
          placeholder="Mobile Number"
          value={formData.mobile_number}
          onChange={(e) =>
            setFormData({
              ...formData,
              mobile_number: e.target.value,
            })
          }
          className="border rounded p-2"
          required
        />

        <input
          type="text"
          placeholder="Vehicle Number"
          value={formData.vehicle_number}
          onChange={(e) =>
            setFormData({
              ...formData,
              vehicle_number: e.target.value,
            })
          }
          className="border rounded p-2"
        />

        <input
          type="text"
          placeholder="Village"
          value={formData.village}
          onChange={(e) =>
            setFormData({
              ...formData,
              village: e.target.value,
            })
          }
          className="border rounded p-2"
        />

        <button
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded col-span-full md:w-48"
        >
          Add Delivery Partner
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3">Partner</th>

              <th className="p-3">Mobile</th>

              <th className="p-3">Vehicle</th>

              <th className="p-3">Village</th>

              <th className="p-3">Status</th>

              <th className="p-3">Action</th>

            </tr>

          </thead>

          <tbody>

            {partners.map((partner) => (

              <tr
                key={partner.id}
                className="border-t"
              >

                <td className="p-3">
                  {partner.partner_name}
                </td>

                <td className="p-3">
                  {partner.mobile_number}
                </td>

                <td className="p-3">
                  {partner.vehicle_number}
                </td>

                <td className="p-3">
                  {partner.village}
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      partner.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {partner.status ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-3">
                  <button
                    onClick={async () => {
                      await togglePartnerStatus(partner.id);
                      loadPartners();
                    }}
                    className="text-blue-600"
                  >
                    Toggle Status
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

export default DeliveryManagement;