import api from "./api";

export const getFeaturedProducts = async () => {
  const response = await api.get("/products/featured");
  return response.data;
};

export const getPopularProducts = async () => {
  const response = await api.get("/products/popular");
  return response.data;
};

export const getProductsByCategory = async (id) => {
  const response = await api.get(`/products/category/${id}`);
  return response.data;
};

export const searchProducts = async (keyword) => {
  const response = await api.get(`/products/search/${keyword}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};