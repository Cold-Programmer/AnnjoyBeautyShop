"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { Product } from "./data";

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  function addItem(product: Product, quantity = 1) {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.slug === product.slug);
      if (existing) {
        return prev.map((l) =>
          l.product.slug === product.slug ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [...prev, { product, quantity }];
    });
  }

  function removeItem(slug: string) {
    setLines((prev) => prev.filter((l) => l.product.slug !== slug));
  }

  function updateQuantity(slug: string, quantity: number) {
    if (quantity <= 0) return removeItem(slug);
    setLines((prev) => prev.map((l) => (l.product.slug === slug ? { ...l, quantity } : l)));
  }

  function clear() {
    setLines([]);
  }

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0),
    [lines]
  );
  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  return (
    <CartContext.Provider value={{ lines, addItem, removeItem, updateQuantity, clear, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
