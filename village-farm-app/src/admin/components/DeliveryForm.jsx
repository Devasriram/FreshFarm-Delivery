import { useState } from "react";

function DeliveryForm({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    partner_name: "",
    mobile_number: "",
    vehicle_number: "",
    village: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-5">
          Add Delivery Partner
        </h2>

        <form onSubmit={submit} className="space-y-4">

          <input
            name="partner_name"
            placeholder="Partner Name"
            className="w-full border rounded p-2"
            onChange={handleChange}
            required
          />

          <input
            name="mobile_number"
            placeholder="Mobile Number"
            className="w-full border rounded p-2"
            onChange={handleChange}
            required
          />

          <input
            name="vehicle_number"
            placeholder="Vehicle Number"
            className="w-full border rounded p-2"
            onChange={handleChange}
          />

          <input
            name="village"
            placeholder="Village"
            className="w-full border rounded p-2"
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              className="bg-green-600 text-white px-5 py-2 rounded"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default DeliveryForm;