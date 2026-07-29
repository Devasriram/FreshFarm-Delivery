import axios from "axios";

const API = "http://127.0.0.1:8000/addresses";

const getToken = () => {
  return localStorage.getItem("token");
};

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getAddresses = async () => {
  const response = await axios.get(API, authHeader());
  return response.data;
};

export const getAddress = async (id) => {
  const response = await axios.get(`${API}/${id}`, authHeader());
  return response.data;
};

export const addAddress = async (data) => {
  const response = await axios.post(API, data, authHeader());
  return response.data;
};

export const updateAddress = async (id, data) => {
  const response = await axios.put(
    `${API}/${id}`,
    data,
    authHeader()
  );
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await axios.delete(
    `${API}/${id}`,
    authHeader()
  );
  return response.data;
};

export const setDefaultAddress = async (id) => {
  const response = await axios.put(
    `${API}/default/${id}`,
    {},
    authHeader()
  );
  return response.data;
};