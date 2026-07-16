import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-yellow-300 font-semibold"
      : "hover:text-green-200";

  return (
    <header className="bg-green-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Header */}
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
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

            <NavLink
              to="/home"
              className={navLinkClass}
            >
              Categories
            </NavLink>

            <NavLink
              to="/home"
              className={navLinkClass}
            >
              Featured
            </NavLink>

            <NavLink
              to="/home"
              className={navLinkClass}
            >
              Popular
            </NavLink>

            {/* Cart */}

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

            {/* Profile */}

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
            {mobileMenu ? (
              <X size={30} />
            ) : (
              <Menu size={30} />
            )}
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

              <NavLink
                to="/home"
                onClick={() => setMobileMenu(false)}
              >
                Categories
              </NavLink>

              <NavLink
                to="/home"
                onClick={() => setMobileMenu(false)}
              >
                Featured
              </NavLink>

              <NavLink
                to="/home"
                onClick={() => setMobileMenu(false)}
              >
                Popular
              </NavLink>

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