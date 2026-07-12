"use client";

import { createContext, useState, useEffect, useContext } from "react";
import type { CartItem } from "@/types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (
    id: number,
    color: string,
    size: string | undefined,
    delta: number
  ) => void;
  removeFromCart: (id: number, color: string, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // context/CartContext.tsx — reemplaza el useEffect de carga
useEffect(() => {
  const savedCart = localStorage.getItem("cart-klh");
  if (savedCart) {
    try {
      const parsed: unknown = JSON.parse(savedCart);
      if (Array.isArray(parsed)) {
        setCart(parsed as CartItem[]);
      }
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
    }
  }
  setIsHydrated(true);
}, []);

  // Persistencia — solo después de haber hidratado, evita sobrescribir con []
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("cart-klh", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.id === newItem.id &&
          item.color === newItem.color &&
          item.size === newItem.size
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === newItem.id &&
          item.color === newItem.color &&
          item.size === newItem.size
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prevCart, newItem];
    });
  };

  const updateQuantity = (
    id: number,
    color: string,
    size: string | undefined,
    delta: number
  ) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number, color: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.color === color && item.size === size)
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};