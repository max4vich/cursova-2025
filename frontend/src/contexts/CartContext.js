import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { request } from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const defaultCart = {
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0,
  promotion: null,
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cart, setCart] = useState(defaultCart);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(defaultCart);
      return;
    }
    setLoading(true);
    try {
      const data = await request("/cart");
      setCart(data);
    } catch (error) {
      console.error("Не вдалося завантажити кошик", error);
      setCart(defaultCart);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchCart();
  }, [authLoading, isAuthenticated]);

  const mutate = async (path, options) => {
    if (!isAuthenticated) {
      throw new Error("Спочатку авторизуйтесь, щоб керувати кошиком");
    }
    const data = await request(path, options);
    setCart(data);
    return data;
  };

  const addItem = (productId, quantity = 1) =>
    mutate("/cart/items", { method: "POST", body: { productId, quantity } });

  const removeItem = (itemId) =>
    mutate(`/cart/items/${itemId}`, { method: "DELETE" });

  const updateQuantity = (itemId, quantity) =>
    mutate(`/cart/items/${itemId}`, { method: "PATCH", body: { quantity } });

  const clearCart = () => mutate("/cart", { method: "DELETE" });

  const applyPromoCode = async (code) => {
    try {
      await mutate("/cart/apply-promo", {
        method: "POST",
        body: { code },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removePromoCode = () =>
    mutate("/cart/promo", {
      method: "DELETE",
    });

  const itemCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items]
  );

  const value = {
    ...cart,
    itemCount,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
    refresh: fetchCart,
    isReady: !loading && (!authLoading || !isAuthenticated),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

