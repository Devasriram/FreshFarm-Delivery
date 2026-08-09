import axios from "axios";

const API_URL = "http://127.0.0.1:8000/admin/products";

export const getProducts = async (search = "") => {
  const response = await axios.get(API_URL, {
    params: { search },
  });

  return response.data;
};

export const createProduct = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const toggleProductStatus = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/status`);
  return response.data;
};

export const updateStock = async (id, stock) => {
  const response = await axios.patch(
    `${API_URL}/${id}/stock`,
    null,
    {
      params: { stock },
    }
  );
  return response.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(
    "http://127.0.0.1:8000/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.image_url;
};