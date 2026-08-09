import axios from "axios";

const API_URL = "http://127.0.0.1:8000/admin/orders";

export const getOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await axios.patch(
    `${API_URL}/${id}/status`,
    null,
    {
      params: { status },
    }
  );

  return response.data;
};