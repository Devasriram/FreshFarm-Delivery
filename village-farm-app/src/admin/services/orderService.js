import axios from "axios";

const API_URL = "http://127.0.0.1:8000/admin/orders";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getOrders = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getOrderDetails = async (orderId) => {
  const response = await axios.get(`${API_URL}/${orderId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateOrderStatus = async (id, status, estimated_delivery_time = null) => {
  const payload = { status };
  if (estimated_delivery_time) {
    payload.estimated_delivery_time = estimated_delivery_time;
  }
  const response = await axios.patch(`${API_URL}/${id}/status`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const assignDeliveryPartner = async (orderId, deliveryPartnerId, estimated_delivery_time = null) => {
  const payload = { delivery_partner_id: deliveryPartnerId };
  if (estimated_delivery_time) {
    payload.estimated_delivery_time = estimated_delivery_time;
  }
  const response = await axios.patch(`${API_URL}/${orderId}/assign`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getOrderTimeline = async (orderId) => {
  const response = await axios.get(`${API_URL}/${orderId}/timeline`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const cancelOrderAdmin = async (orderId, reason = "Cancelled by Admin") => {
  const response = await axios.put(
    `${API_URL}/${orderId}/cancel`,
    { reason },
    { headers: getAuthHeaders() }
  );
  return response.data;
};