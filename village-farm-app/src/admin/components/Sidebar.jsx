import { NavLink, useNavigate } from "react-router-dom";

const menus = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Categories", path: "/admin/categories" },
  { name: "Products", path: "/admin/products" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Customers", path: "/admin/customers" },
  { name: "Delivery", path: "/admin/delivery" },
  { name: "Reports", path: "/admin/reports" },
  { name: "Profile", path: "/admin/profile" },
];

function Sidebar() {
  const navigate = useNavigate();   // ✅ Correct

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-green-700 text-white">

      <h1 className="text-2xl font-bold p-6">
        Village Farm
      </h1>

      <nav className="mt-5">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `block px-6 py-3 hover:bg-green-600 ${
                isActive ? "bg-green-900" : ""
              }`
            }
          >
            {menu.name}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="w-full text-left px-6 py-3 hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

    </aside>
  );
}

export default Sidebar;