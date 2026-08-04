import api from "./api";

/**
 * Place a New Order
 */
export const placeOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

/**
 * Get All Orders of Logged-in Customer
 */
export const getOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data;
};

/**
 * Get Order Details
 */
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

/**
 * Get Order Tracking Timeline
 */
export const getOrderTracking = async (orderId) => {
  const response = await api.get(`/orders/${orderId}/tracking`);
  return response.data;
};

/**
 * Cancel Order
 */
export const cancelOrder = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/cancel`);
  return response.data;
};

/**
 * Reorder Previous Order
 */
export const reorderOrder = async (orderId) => {
  const response = await api.post(`/orders/${orderId}/reorder`);
  return response.data;
};