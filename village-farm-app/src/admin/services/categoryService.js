import axios from "axios";

const API_URL = "http://127.0.0.1:8000/admin/categories";

export const getCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createCategory = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const toggleCategoryStatus = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/status`);
  return response.data;
};