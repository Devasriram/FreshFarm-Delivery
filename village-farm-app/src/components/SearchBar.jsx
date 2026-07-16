import { useState } from "react";
import { Search } from "lucide-react";

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-7xl mx-auto px-6 py-6"
    >
      <div className="flex flex-col md:flex-row gap-4">

        <div className="flex items-center flex-1 bg-white rounded-2xl shadow-lg px-6">

          <Search
            className="text-gray-500"
            size={28}
          />

          <input
            type="text"
            placeholder="Search milk, fish, eggs..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (e.target.value === "") {
                onSearch("");
              }
            }}
            className="flex-1 py-5 px-4 text-xl outline-none"
          />

        </div>

        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white text-xl font-semibold px-12 py-5 rounded-2xl transition"
        >
          Search
        </button>

      </div>
    </form>
  );
}

export default SearchBar;