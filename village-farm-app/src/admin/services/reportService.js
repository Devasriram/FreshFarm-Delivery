import axios from "axios";

const API_URL = "http://127.0.0.1:8000/admin/reports";

export const getSummary = async () => {
  const response = await axios.get(`${API_URL}/summary`);
  return response.data;
};

export const getMonthlySales = async () => {
  const response = await axios.get(`${API_URL}/monthly-sales`);
  return response.data;
};

