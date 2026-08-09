import { useState, useEffect } from "react";

function CategoryForm({ onSave, onClose, initialData }) {
  const [formData, setFormData] = useState({
    category_name: "",
    category_image: "",
    status: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

        <h2 className="text-2xl font-bold mb-5">
          {initialData ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="category_name"
            placeholder="Category Name"
            value={formData.category_name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            name="category_image"
            placeholder="Image URL"
            value={formData.category_image}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
            Enabled
          </label>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Save
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default CategoryForm;