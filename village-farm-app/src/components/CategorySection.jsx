import { useEffect, useState } from "react";

import CategoryCard from "./CategoryCard";
import { getCategories } from "../services/categoryService";

function CategorySection() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadCategories();

  }, []);

  const loadCategories = async () => {

    try {

      const data = await getCategories();

      setCategories(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <div className="text-center py-10">

        Loading Categories...

      </div>

    );

  }

  if (categories.length === 0) {

    return (

      <div className="text-center py-10 text-gray-500">

        No Categories Found

      </div>

    );

  }

  return (

    <div className="max-w-7xl mx-auto">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {categories.map((category) => (

          <CategoryCard
            key={category.id}
            category={category}
          />

        ))}

      </div>

    </div>

  );

}

export default CategorySection;