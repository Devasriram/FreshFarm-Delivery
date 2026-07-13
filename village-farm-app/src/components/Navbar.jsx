import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-green-700 text-white shadow">
      <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          🌿 Farm Fresh
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;