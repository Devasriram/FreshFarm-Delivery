import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/delivery";

const getDeliveryToken = () => {
  return localStorage.getItem("delivery_token");
};

const getDeliveryAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${getDeliveryToken()}`,
  },
});

// Partner Login
export const loginDeliveryPartner = async (loginData) => {
  const response = await axios.post(`${API_BASE}/auth/login`, loginData);
  return response.data;
};

// Partner Profile
export const getDeliveryPartnerProfile = async () => {
  const response = await axios.get(`${API_BASE}/profile`, getDeliveryAuthHeader());
  return response.data;
};

// Partner Dashboard Stats
export const getDeliveryDashboardStats = async () => {
  const response = await axios.get(`${API_BASE}/dashboard`, getDeliveryAuthHeader());
  return response.data;
};

// Active Assigned Orders
export const getAssignedOrders = async () => {
  const response = await axios.get(`${API_BASE}/orders/assigned`, getDeliveryAuthHeader());
  return response.data;
};

// Update Delivery Status (Accepted, Picked Up, Out for Delivery, Delivered)
export const updateOrderDeliveryStatus = async (orderId, status) => {
  const response = await axios.patch(
    `${API_BASE}/orders/${orderId}/status`,
    { status },
    getDeliveryAuthHeader()
  );
  return response.data;
};

// Delivery History (Delivered Orders)
export const getDeliveryHistory = async () => {
  const response = await axios.get(`${API_BASE}/history`, getDeliveryAuthHeader());
  return response.data;
};

// Toggle / Update Availability Status (Available, Busy, Offline)
export const updateAvailabilityStatus = async (availability_status) => {
  const response = await axios.patch(
    `${API_BASE}/availability`,
    { availability_status },
    getDeliveryAuthHeader()
  );
  return response.data;
};
