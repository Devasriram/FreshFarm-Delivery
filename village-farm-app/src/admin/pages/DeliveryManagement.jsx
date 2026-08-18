import { useEffect, useState } from "react";
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Package,
  Search,
  Eye,
  Send,
  RefreshCw,
  Phone,
  Mail,
  User,
} from "lucide-react";
import {
  getDeliveryPartners,
  createDeliveryPartner,
  updateDeliveryPartner,
  togglePartnerStatus,
  deleteDeliveryPartner,
  getPartnerOrders,
  assignOrderToPartner,
} from "../services/deliveryService";
import axios from "axios";

function DeliveryManagement() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [selectedPartner, setSelectedPartner] = useState(null);
  const [partnerOrders, setPartnerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Available orders for assignment
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    partner_name: "",
    mobile_number: "",
    email: "",
    vehicle_number: "",
    password: "",
    availability_status: "Available",
  });

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const data = await getDeliveryPartners();
      setPartners(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load delivery partners.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      partner_name: "",
      mobile_number: "",
      email: "",
      vehicle_number: "",
      password: "password123",
      availability_status: "Available",
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (partner) => {
    setSelectedPartner(partner);
    setFormData({
      partner_name: partner.partner_name,
      mobile_number: partner.mobile_number,
      email: partner.email || "",
      vehicle_number: partner.vehicle_number || "",
      password: "",
      availability_status: partner.availability_status || "Available",
    });
    setShowEditModal(true);
  };

  const handleViewOrders = async (partner) => {
    setSelectedPartner(partner);
    setShowOrdersModal(true);
    setLoadingOrders(true);
    try {
      const orders = await getPartnerOrders(partner.id);
      setPartnerOrders(orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleOpenAssign = async (partner) => {
    setSelectedPartner(partner);
    setShowAssignModal(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/admin/orders");
      // filter orders that are not delivered or cancelled
      const active = res.data.filter(
        (o) => o.order_status !== "Delivered" && o.order_status !== "Cancelled"
      );
      setUnassignedOrders(active);
      if (active.length > 0) {
        setSelectedOrderId(active[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDeliveryPartner(formData);
      setShowAddModal(false);
      loadPartners();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create partner.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDeliveryPartner(selectedPartner.id, formData);
      setShowEditModal(false);
      loadPartners();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update partner.");
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrderId) {
      alert("Please select an order to assign.");
      return;
    }
    try {
      await assignOrderToPartner(Number(selectedOrderId), selectedPartner.id);
      alert("Order successfully assigned!");
      setShowAssignModal(false);
      loadPartners();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to assign order.");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await togglePartnerStatus(id);
      loadPartners();
    } catch (err) {
      alert("Failed to toggle status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this delivery partner?")) return;
    try {
      await deleteDeliveryPartner(id);
      loadPartners();
    } catch (err) {
      alert("Failed to delete delivery partner.");
    }
  };

  const filteredPartners = partners.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.partner_name?.toLowerCase().includes(term) ||
      p.partner_id?.toLowerCase().includes(term) ||
      p.mobile_number?.includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700 mr-3"></div>
        <span>Loading Delivery Partners...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2.5">
            <Truck className="text-green-700" size={32} />
            <span>Delivery Management</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage delivery partner onboarding, availability, order dispatch, and live status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition"
          >
            <Plus size={18} />
            <span>Add Delivery Partner</span>
          </button>
        </div>
      </div>

      {/* Search & Overview Stats */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Partner ID, Name or Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
          <div>
            Total Partners: <span className="font-bold text-gray-900">{partners.length}</span>
          </div>
          <div>•</div>
          <div>
            Active:{" "}
            <span className="font-bold text-green-700">
              {partners.filter((p) => p.status).length}
            </span>
          </div>
          <div>•</div>
          <div>
            Available for Dispatch:{" "}
            <span className="font-bold text-blue-700">
              {partners.filter((p) => p.status && p.availability_status === "Available").length}
            </span>
          </div>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4">Partner ID</th>
                <th className="p-4">Partner Details</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Assigned Orders</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    No delivery partners found. Click &quot;Add Delivery Partner&quot; to onboard.
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-mono font-bold text-green-800">
                      {partner.partner_id || `DP${partner.id.toString().padStart(3, "0")}`}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-gray-900">{partner.partner_name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <Phone size={12} /> {partner.mobile_number}
                        {partner.email && (
                          <>
                            <span>•</span>
                            <Mail size={12} /> {partner.email}
                          </>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-medium text-gray-600">
                      {partner.vehicle_number || "—"}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleViewOrders(partner)}
                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-lg text-xs font-bold transition"
                      >
                        <Package size={14} />
                        <span>{partner.assigned_orders_count || 0} Orders</span>
                      </button>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          partner.availability_status === "Available"
                            ? "bg-green-100 text-green-800"
                            : partner.availability_status === "Busy"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {partner.availability_status || "Available"}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(partner.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                          partner.status
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {partner.status ? "Active" : "Disabled"}
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenAssign(partner)}
                          title="Assign Order"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
                        >
                          <Send size={13} />
                          <span>Assign</span>
                        </button>

                        <button
                          onClick={() => handleOpenEdit(partner)}
                          title="Edit Partner"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(partner.id)}
                          title="Delete Partner"
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PARTNER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Add New Delivery Partner</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.partner_name}
                  onChange={(e) =>
                    setFormData({ ...formData, partner_name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="10-digit mobile"
                    value={formData.mobile_number}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile_number: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="optional"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TN-55-AB-1234"
                    value={formData.vehicle_number}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicle_number: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Default Password
                  </label>
                  <input
                    type="text"
                    placeholder="default: 123456"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-green-700 hover:bg-green-800 text-white rounded-xl shadow"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PARTNER MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Edit Delivery Partner ({selectedPartner?.partner_id})
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.partner_name}
                  onChange={(e) =>
                    setFormData({ ...formData, partner_name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mobile_number}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile_number: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    value={formData.vehicle_number}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicle_number: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Availability
                  </label>
                  <select
                    value={formData.availability_status}
                    onChange={(e) =>
                      setFormData({ ...formData, availability_status: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Change Password (optional)
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-green-700 hover:bg-green-800 text-white rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ASSIGNED ORDERS MODAL */}
      {showOrdersModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Assigned Orders for {selectedPartner?.partner_name} ({selectedPartner?.partner_id})
                </h2>
                <p className="text-xs text-gray-500">
                  {partnerOrders.length} orders currently linked to this partner
                </p>
              </div>
              <button
                onClick={() => setShowOrdersModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {loadingOrders ? (
                <div className="text-center py-10 text-gray-500 text-sm">
                  Loading assigned orders...
                </div>
              ) : partnerOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">
                  No orders currently assigned to this delivery partner.
                </div>
              ) : (
                partnerOrders.map((ord) => (
                  <div
                    key={ord.order_id}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-gray-900 text-sm">
                        Order #{ord.order_number}
                      </div>
                      <div className="text-gray-600 mt-1">
                        Customer: <strong>{ord.customer_name}</strong> ({ord.mobile_number})
                      </div>
                      <div className="text-gray-500 mt-0.5">{ord.address}</div>
                    </div>

                    <div className="text-right flex flex-col justify-between items-end">
                      <div className="font-bold text-green-700 text-sm">
                        ₹{ord.grand_total}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                        {ord.delivery_status || ord.order_status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setShowOrdersModal(false)}
                className="px-5 py-2 bg-gray-800 text-white rounded-xl text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ASSIGN ORDER MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Assign Order to {selectedPartner?.partner_name}
            </h2>
            <p className="text-xs text-gray-500">
              Select an active customer order to dispatch to this partner.
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Active Orders
                </label>
                {unassignedOrders.length === 0 ? (
                  <p className="text-sm text-gray-500 italic py-2">
                    No active pending orders available for assignment.
                  </p>
                ) : (
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500"
                  >
                    {unassignedOrders.map((ord) => (
                      <option key={ord.id} value={ord.id}>
                        #{ord.order_number} — {ord.customer_name} (₹{ord.total_amount}) [{ord.order_status}]
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={unassignedOrders.length === 0}
                  className="px-5 py-2 text-sm font-semibold bg-green-700 hover:bg-green-800 text-white rounded-xl shadow disabled:opacity-50"
                >
                  Assign Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryManagement;