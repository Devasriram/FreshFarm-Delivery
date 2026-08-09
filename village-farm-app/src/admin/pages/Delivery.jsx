import { useEffect, useState } from "react";

import DeliveryForm from "../components/DeliveryForm";

import {
  getDeliveryPartners,
  createDeliveryPartner,
  togglePartnerStatus,
} from "../services/deliveryService";

function Delivery() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const data = await getDeliveryPartners();
      setPartners(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    await createDeliveryPartner(data);
    setShowForm(false);
    loadPartners();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Delivery Management
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Partner
        </button>

      </div>

      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Village</th>
              <th className="p-3">Status</th>
            </tr>

          </thead>

          <tbody>

            {partners.map((partner) => (

              <tr key={partner.id} className="border-t">

                <td className="p-3">{partner.partner_name}</td>

                <td className="p-3">{partner.mobile_number}</td>

                <td className="p-3">{partner.vehicle_number}</td>

                <td className="p-3">{partner.village}</td>

                <td className="p-3">

                  <button
                    onClick={async () => {
                      await togglePartnerStatus(partner.id);
                      loadPartners();
                    }}
                    className={`px-3 py-1 rounded ${
                      partner.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {partner.status ? "Enabled" : "Disabled"}
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {showForm && (
        <DeliveryForm
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}

    </div>
  );
}

export default Delivery;