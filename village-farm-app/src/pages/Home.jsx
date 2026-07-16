import { useEffect, useState } from "react";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import HeroBanner from "../components/HeroBanner";
import CategorySection from "../components/CategorySection";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";

import {
  getFeaturedProducts,
  getPopularProducts,
  searchProducts,
} from "../services/productService";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  const [searchResults, setSearchResults] = useState([]);
  const [searchMode, setSearchMode] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const featured = await getFeaturedProducts();
      const popular = await getPopularProducts();

      setFeaturedProducts(featured);
      setPopularProducts(popular);
    } catch (err) {
      console.error(err);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (keyword) => {
    if (keyword.trim() === "") {
      setSearchMode(false);
      setSearchResults([]);
      return;
    }

    try {
      const data = await searchProducts(keyword);
      setSearchResults(data);
      setSearchMode(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">

      {/* Header */}
      <Header />

      {/* Search */}
      <SearchBar onSearch={handleSearch} />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Shop By Category
        </h2>

        <CategorySection />

      </section>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-lg font-medium">
          Loading Products...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-10 text-red-600 text-lg">
          {error}
        </div>
      )}

      {/* Search Results */}
      {!loading && !error && searchMode && (
        <section className="max-w-7xl mx-auto px-6 py-4">
          <ProductSection
            title="Search Results"
            products={searchResults}
          />
        </section>
      )}

      {/* Featured Products */}
      {!loading && !error && !searchMode && (
        <section className="max-w-7xl mx-auto px-6 py-4">
          <ProductSection
            title="Featured Products"
            products={featuredProducts}
          />
        </section>
      )}

      {/* Popular Products */}
      {!loading && !error && !searchMode && (
        <section className="max-w-7xl mx-auto px-6 py-8">
          <ProductSection
            title="Popular Products"
            products={popularProducts}
          />
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;