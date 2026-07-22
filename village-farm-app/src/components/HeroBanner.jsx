function HeroBanner() {

  const handleShopNow = () => {
    const section = document.getElementById("categories");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6">

      <div className="rounded-3xl bg-gradient-to-r from-green-600 to-green-400 text-white p-12 shadow-lg">

        <h1 className="text-5xl font-bold">
          Fresh From Farm
        </h1>

        <p className="mt-5 text-xl">
          Fresh Milk • Fish • Chicken • Eggs • Goat Meat
        </p>

        <p className="mt-2 text-lg">
          Farm fresh products delivered directly to your doorstep.
        </p>

        <button
          onClick={handleShopNow}
          className="mt-8 bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition duration-300"
        >
          Shop Now
        </button>

      </div>

    </section>
  );
}

export default HeroBanner;