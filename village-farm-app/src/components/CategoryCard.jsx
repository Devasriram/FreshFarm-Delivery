import { useNavigate } from "react-router-dom";

function CategoryCard({ category }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/category/${category.id}`)}
      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer group"
    >
      <div className="overflow-hidden">

        <img
          src={`/images/categories/${category.category_image}`}
          alt={category.category_name}
          className="w-full h-60 object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => {
            e.target.src = "/images/no-image.png";
          }}
        />

      </div>

      <div className="p-5">

        <h2 className="text-2xl font-bold text-gray-800">
          {category.category_name}
        </h2>

        <p className="text-gray-500 mt-2">
          {category.product_count} Products
        </p>

      </div>
    </div>
  );
}

export default CategoryCard;