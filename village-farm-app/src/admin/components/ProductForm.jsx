import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { uploadImage } from "../services/productService";

function ProductForm({
    initialData,
    onSave,
    onClose,
}) {
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        category_id: "",
        product_name: "",
        product_image: "",
        price: "",
        stock: "",
        unit: "Kg",
        description: "",
        is_featured: false,
        status: true,
        freshness_info: "Freshly harvested today",
        delivery_available: true,
        additional_images: "",
    });

    useEffect(() => {
        loadCategories();

        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };

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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

            <div className="bg-white w-full max-w-xl rounded-lg p-6">

                <h2 className="text-2xl font-bold mb-4">
                    {initialData ? "Edit Product" : "Add Product"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    >
                        <option value="">Select Category</option>

                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="product_name"
                        placeholder="Product Name"
                        value={formData.product_name}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />

                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full border rounded p-2"
                            onChange={async (e) => {
                                const file = e.target.files[0];

                                if (!file) return;

                                try {
                                    const imageUrl = await uploadImage(file);

                                    setFormData((prev) => ({
                                        ...prev,
                                        product_image: imageUrl,
                                    }));
                                } catch (err) {
                                    console.error(err);
                                    alert("Image upload failed.");
                                }
                            }}
                        />

                        {formData.product_image && (
                            <img
                                src={`http://127.0.0.1:8000${formData.product_image}`}
                                alt="Preview"
                                className="mt-3 w-28 h-28 rounded object-cover border"
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">

                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                            className="border rounded p-2"
                        />

                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="border rounded p-2"
                        />

                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="border rounded p-2"
                        >
                            <option>Kg</option>
                            <option>Litre</option>
                            <option>Piece</option>
                        </select>

                    </div>

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />

                    <div className="flex gap-6">

                        <label>
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                            />
                            <span className="ml-2">Featured</span>
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="delivery_available"
                                checked={formData.delivery_available}
                                onChange={handleChange}
                            />
                            <span className="ml-2">Delivery Available</span>
                        </label>

                    </div>

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>

                        <button
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

export default ProductForm;