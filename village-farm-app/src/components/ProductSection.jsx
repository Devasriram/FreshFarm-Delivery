import ProductCard from "./ProductCard";

function ProductSection({ title, products }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-8">
        {title}
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No products available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductSection;