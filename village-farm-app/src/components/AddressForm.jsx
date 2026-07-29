import { useEffect, useState } from "react";

function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState({
    full_name: "",
    mobile_number: "",
    door_street: "",
    village: "",
    district: "",
    state: "",
    pincode: "",
    landmark: "",
    is_default: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        full_name: initialData.full_name || "",
        mobile_number: initialData.mobile_number || "",
        door_street: initialData.door_street || "",
        village: initialData.village || "",
        district: initialData.district || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
        landmark: initialData.landmark || "",
        is_default: initialData.is_default || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.full_name ||
      !form.mobile_number ||
      !form.door_street ||
      !form.village ||
      !form.district ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!/^\d{10}$/.test(form.mobile_number)) {
      alert("Mobile number must contain 10 digits.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      alert("Pincode must contain 6 digits.");
      return;
    }

    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? "Edit Address" : "Add New Address"}
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="font-medium">Full Name *</label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">Mobile Number *</label>
          <input
            type="text"
            name="mobile_number"
            value={form.mobile_number}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-medium">
            Door No / Street *
          </label>
          <input
            type="text"
            name="door_street"
            value={form.door_street}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">Village *</label>
          <input
            type="text"
            name="village"
            value={form.village}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">District *</label>
          <input
            type="text"
            name="district"
            value={form.district}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">State *</label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-medium">
            Landmark (Optional)
          </label>
          <input
            type="text"
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            name="is_default"
            checked={form.is_default}
            onChange={handleChange}
          />

          <label>Set as Default Address</label>
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-8">

        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-lg border"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Update Address"
            : "Save Address"}
        </button>

      </div>
    </form>
  );
}

export default AddressForm;