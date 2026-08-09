import axios from "axios";

const API_URL = "http://127.0.0.1:8000/admin/customers";

export const getCustomers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const toggleCustomerStatus = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/status`);
  return response.data;
};