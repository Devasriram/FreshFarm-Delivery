import api from "./api";

// Add product to cart
export const addCartItem = async (productId, quantity = 1) => {
  const response = await api.post("/cart/add", {
    product_id: productId,
    quantity,
  });

  return response.data;
};

// Get all cart items
export const getCartItems = async () => {
  const response = await api.get("/cart/");
  return response.data;
};

// Update quantity
export const updateCartItem = async (cartId, quantity) => {
  const response = await api.put(`/cart/update/${cartId}`, {
    quantity,
  });

  return response.data;
};

// Remove item
export const removeCartItem = async (cartId) => {
  const response = await api.delete(`/cart/remove/${cartId}`);

  return response.data;
};

// Clear cart
export const clearBackendCart = async () => {
  const response = await api.delete("/cart/clear");

  return response.data;
};

// Cart summary
export const getCartSummary = async () => {
  const response = await api.get("/cart/summary");

  return response.data;
};