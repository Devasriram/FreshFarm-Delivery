import { useEffect, useState } from "react";

import ProductForm from "../components/ProductForm";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
} from "../services/productService";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, [search]);

    const loadProducts = async () => {
        setLoading(true);

        try {
            const data = await getProducts(search);
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProduct = async (data) => {
        try {
            if (selectedProduct) {
                await updateProduct(selectedProduct.id, data);
            } else {
                await createProduct(data);
            }

            setShowForm(false);
            setSelectedProduct(null);

            loadProducts();
        } catch (error) {
            alert(error.response?.data?.detail || "Operation failed.");
        }
    };
    if (loading) {
        return <p className="text-lg">Loading Products...</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    Product Management
                </h1>

                <div className="flex gap-3">

                    <input
                        type="text"
                        placeholder="Search Product..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <button
                        onClick={() => {
                            setSelectedProduct(null);
                            setShowForm(true);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        + Add Product
                    </button>

                </div>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-3">Image</th>

                            <th className="p-3">Product</th>

                            <th className="p-3">Price</th>

                            <th className="p-3">Stock</th>

                            <th className="p-3">Unit</th>

                            <th className="p-3">Status</th>

                            <th className="p-3">Actions</th>

                        </tr>

                    </thead>

                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-8">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="border-t hover:bg-gray-50">

                                    <td className="p-3">
                                        <img
                                            src={
                                                product.product_image
                                                    ? `/images/products/${product.product_image}`
                                                    : "https://via.placeholder.com/60"
                                            }
                                            alt={product.product_name}
                                            className="w-16 h-16 object-cover rounded"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/60";
                                            }}
                                        />
                                    </td>

                                    <td className="p-3">
                                        {product.product_name}
                                    </td>

                                    <td className="p-3">
                                        ₹{product.price}
                                    </td>

                                    <td className="p-3">
                                        {product.stock}
                                    </td>

                                    <td className="p-3">
                                        {product.unit}
                                    </td>

                                    <td className="p-3">
                                        <button
                                            onClick={async () => {
                                                await toggleProductStatus(product.id);
                                                loadProducts();
                                            }}
                                            className={`px-3 py-1 rounded text-white ${product.status
                                                ? "bg-green-600"
                                                : "bg-red-600"
                                                }`}
                                        >
                                            {product.status ? "Enabled" : "Disabled"}
                                        </button>
                                    </td>

                                    <td className="p-3 flex gap-2">

                                        <button
                                            className="bg-blue-600 text-white px-3 py-1 rounded"
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setShowForm(true);
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="bg-red-600 text-white px-3 py-1 rounded"
                                            onClick={async () => {
                                                if (window.confirm("Delete Product?")) {
                                                    await deleteProduct(product.id);
                                                    loadProducts();
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

            </div>
            {showForm && (
                <ProductForm
                    initialData={selectedProduct}
                    onSave={handleSaveProduct}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedProduct(null);
                    }}
                />
            )}

        </div>
    );
}

export default Products;