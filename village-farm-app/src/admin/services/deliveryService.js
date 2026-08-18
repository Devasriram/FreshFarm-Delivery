import axios from "axios";

const API_URL = "http://127.0.0.1:8000/admin/delivery";

export const getDeliveryPartners = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createDeliveryPartner = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateDeliveryPartner = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const togglePartnerStatus = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/status`);
  return response.data;
};

export const getPartnerOrders = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/orders`);
  return response.data;
};

export const assignOrderToPartner = async (orderId, deliveryPartnerId) => {
  const response = await axios.post(`${API_URL}/assign`, {
    order_id: orderId,
    delivery_partner_id: deliveryPartnerId,
  });
  return response.data;
};

export const deleteDeliveryPartner = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};