import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products, promoCodes } from "../data/mockData";

const CartContext = createContext();
const STORAGE_KEY = "techshop:cart";

const findProduct = (productId) =>
  products.find((product) => product.id === Number(productId));

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to parse cart", error);
      return [];
    }
  });
  const [promo, setPromo] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const subtotal = useMemo(
    () =>
      items.reduce((acc, item) => {
        const price = item.discount
          ? item.price * (1 - item.discount / 100)
          : item.price;
        return acc + price * item.quantity;
      }, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!promo) return 0;
    if (promo.type === "percentage") {
      return Math.round((subtotal * promo.value) / 100);
    }
    return promo.value;
  }, [promo, subtotal]);

  const total = Math.max(subtotal - discount, 0);

  const addItem = (productId, quantity = 1) => {
    const product = findProduct(productId);
    if (!product) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { ...product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromo(null);
  };

  const applyPromoCode = (code) => {
    const promoCode = promoCodes.find(
      (p) => p.code.toLowerCase() === code.trim().toLowerCase()
    );
    if (!promoCode) {
      return { success: false, error: "Промокод не знайдено" };
    }
    if (subtotal < promoCode.minOrderAmount) {
      return {
        success: false,
        error: `Мінімальна сума замовлення ${promoCode.minOrderAmount} ₴`,
      };
    }
    setPromo(promoCode);
    return { success: true };
  };

  const removePromoCode = () => setPromo(null);

  const value = {
    items,
    itemCount,
    subtotal,
    discount,
    total,
    promoCode: promo,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
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

