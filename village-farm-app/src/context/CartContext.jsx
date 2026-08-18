import { createContext, useContext, useEffect, useState } from "react";

import {
  addCartItem,
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearBackendCart,
} from "../services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Load Cart From Backend
  // -----------------------------
  const loadCart = async () => {
    try {
      setLoading(true);

      const data = await getCartItems();

      setCart(data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("customer");
        console.warn("Session expired or invalid customer token. Cart cleared.");
      } else {
        console.error("Unable to load cart", err);
      }
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      loadCart();
    }
  }, []);

  // -----------------------------
  // Add To Cart
  // -----------------------------
  const addToCart = async (product) => {
    try {
      await addCartItem(
        product.id,
        product.quantity || 1
      );

      await loadCart();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
          "Unable to add product to cart."
      );
    }
  };

  // -----------------------------
  // Increase Quantity
  // -----------------------------
  const increaseQuantity = async (cartId, quantity) => {
    try {
      await updateCartItem(
        cartId,
        quantity + 1
      );

      await loadCart();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
          "Unable to update quantity."
      );
    }
  };

  // -----------------------------
  // Decrease Quantity
  // -----------------------------
  const decreaseQuantity = async (cartId, quantity) => {
    try {
      if (quantity <= 1) {
        await removeCartItem(cartId);
      } else {
        await updateCartItem(
          cartId,
          quantity - 1
        );
      }

      await loadCart();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
          "Unable to update quantity."
      );
    }
  };

  // -----------------------------
  // Remove Item
  // -----------------------------
  const removeItem = async (cartId) => {
    try {
      await removeCartItem(cartId);

      await loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // Clear Cart
  // -----------------------------
  const clearCart = async () => {
    try {
      await clearBackendCart();

      setCart([]);
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // Totals
  // -----------------------------
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalAmount = cart.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        loadCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);