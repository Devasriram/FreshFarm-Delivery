import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu,
  X,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const { totalItems } = useCart();

  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-yellow-300 font-semibold"
      : "hover:text-green-200";

  const goToSection = (id) => {
    navigate("/home");

    setTimeout(() => {
      const section = document.getElementById(id);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);

    setMobileMenu(false);
  };

  return (
    <header className="bg-green-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="h-16 flex items-center justify-between">

          <Link
            to="/home"
            className="text-white text-2xl font-bold"
          >
            🌿 Village Fresh Farm
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-white">

            <NavLink
              to="/home"
              className={navLinkClass}
            >
              Home
            </NavLink>

            <button
              onClick={() => goToSection("categories")}
              className="hover:text-green-200"
            >
              Categories
            </button>

            <button
              onClick={() => goToSection("featured")}
              className="hover:text-green-200"
            >
              Featured
            </button>

            <button
              onClick={() => goToSection("popular")}
              className="hover:text-green-200"
            >
              Popular
            </button>

            <NavLink
              to="/cart"
              className="relative"
            >
              <ShoppingCart size={24} />

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/customer/dashboard"
              className={navLinkClass}
            >
              <User size={24} />
            </NavLink>

          </nav>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden text-white"
          >
            {mobileMenu ? <X size={30} /> : <Menu size={30} />}
          </button>

        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden bg-green-700 pb-5">

            <div className="flex flex-col gap-4 text-white">

              <NavLink
                to="/home"
                onClick={() => setMobileMenu(false)}
              >
                Home
              </NavLink>

              <button
                onClick={() => goToSection("categories")}
                className="text-left"
              >
                Categories
              </button>

              <button
                onClick={() => goToSection("featured")}
                className="text-left"
              >
                Featured
              </button>

              <button
                onClick={() => goToSection("popular")}
                className="text-left"
              >
                Popular
              </button>

              <NavLink
                to="/cart"
                onClick={() => setMobileMenu(false)}
              >
                Cart ({totalItems})
              </NavLink>

              <NavLink
                to="/customer/dashboard"
                onClick={() => setMobileMenu(false)}
              >
                Profile
              </NavLink>

            </div>

          </div>
        )}

      </div>
    </header>
  );
}

export default Header;