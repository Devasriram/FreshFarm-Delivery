import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { User, MapPin, Phone, Mail, ShoppingBag, Package, LogOut } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const { customer, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-md border border-green-100 p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-green-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-green-700 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-green-700/20">
                {customer?.full_name?.charAt(0) || "C"}
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                  Customer Profile
                </span>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">
                  Welcome, {customer?.full_name}
                </h1>
                <p className="text-xs text-gray-500 font-mono">
                  Customer ID: <strong>{customer?.customer_id}</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                to="/home"
                className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
              >
                Shop Fresh Products
              </Link>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-green-50/60 rounded-2xl p-4 border border-green-100 flex items-start gap-3">
              <Phone size={18} className="text-green-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Mobile Number
                </div>
                <div className="font-bold text-gray-900 text-sm mt-0.5">
                  {customer?.mobile_number}
                </div>
              </div>
            </div>

            <div className="bg-green-50/60 rounded-2xl p-4 border border-green-100 flex items-start gap-3">
              <Mail size={18} className="text-green-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email Address
                </div>
                <div className="font-bold text-gray-900 text-sm mt-0.5">
                  {customer?.email || "Not provided"}
                </div>
              </div>
            </div>

            <div className="bg-green-50/60 rounded-2xl p-4 border border-green-100 flex items-start gap-3">
              <MapPin size={18} className="text-green-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Village / Location
                </div>
                <div className="font-bold text-gray-900 text-sm mt-0.5">
                  {customer?.village || "Not provided"}
                </div>
              </div>
            </div>

            <div className="bg-green-50/60 rounded-2xl p-4 border border-green-100 flex items-start gap-3">
              <Package size={18} className="text-green-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Orders & Tracking
                </div>
                <Link
                  to="/my-orders"
                  className="font-bold text-green-800 text-sm mt-0.5 inline-block hover:underline"
                >
                  View My Orders →
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-green-100 pt-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/my-orders"
              className="inline-flex items-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 px-5 py-2.5 rounded-xl text-xs font-bold transition"
            >
              <ShoppingBag size={16} />
              <span>Track Orders</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;