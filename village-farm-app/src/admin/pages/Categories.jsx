import { useEffect, useState } from "react";
import CategoryForm from "../components/CategoryForm";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
} from "../services/categoryService";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCategory = async (data) => {
        try {
            if (selectedCategory) {
                await updateCategory(selectedCategory.id, data);
            } else {
                await createCategory(data);
            }

            setShowForm(false);
            setSelectedCategory(null);

            loadCategories();
        } catch (error) {
            alert(error.response?.data?.detail || "Operation failed");
        }
    };

    if (loading) {
        return <p className="text-lg">Loading...</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    Category Management
                </h1>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    + Add Category
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Image</th>
                            <th className="p-3 text-left">Category Name</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-t">
                                <td className="p-3">
                                    <img
                                        src={`/images/categories/${category.category_image}`}
                                        alt={category.category_name}
                                        className="w-14 h-14 rounded object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/60";
                                        }}
                                    />
                                </td>

                                <td className="p-3 font-medium">
                                    {category.category_name}
                                </td>

                                <td className="p-3">
                                    <button
                                        onClick={async () => {
                                            try {
                                                await toggleCategoryStatus(category.id);
                                                loadCategories();
                                            } catch (error) {
                                                alert(
                                                    error.response?.data?.detail ||
                                                    "Failed to update status"
                                                );
                                            }
                                        }}
                                        className={`px-3 py-1 rounded-full text-sm ${category.status
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {category.status ? "Enabled" : "Disabled"}
                                    </button>
                                </td>

                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            setShowForm(true);
                                        }}
                                        className="text-blue-600 mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!window.confirm("Delete this category?")) return;

                                            try {
                                                await deleteCategory(category.id);
                                                loadCategories();
                                            } catch (error) {
                                                alert(
                                                    error.response?.data?.detail ||
                                                    "Failed to delete category"
                                                );
                                            }
                                        }}
                                        className="text-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <CategoryForm
                    initialData={selectedCategory}
                    onSave={handleSaveCategory}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedCategory(null);
                    }}
                />
            )}
        </div>
    );
}

export default Categories;