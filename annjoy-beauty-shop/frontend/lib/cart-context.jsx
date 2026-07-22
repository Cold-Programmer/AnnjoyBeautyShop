"use client";
import { createContext, useContext, useMemo, useState } from "react";
const CartContext = createContext(undefined);
export function CartProvider({ children }) {
    const [lines, setLines] = useState([]);
    function addItem(product, quantity = 1) {
        setLines((prev) => {
            const existing = prev.find((l) => l.product.slug === product.slug);
            if (existing) {
                return prev.map((l) => l.product.slug === product.slug ? { ...l, quantity: l.quantity + quantity } : l);
            }
            return [...prev, { product, quantity }];
        });
    }
    function removeItem(slug) {
        setLines((prev) => prev.filter((l) => l.product.slug !== slug));
    }
    function updateQuantity(slug, quantity) {
        if (quantity <= 0)
            return removeItem(slug);
        setLines((prev) => prev.map((l) => (l.product.slug === slug ? { ...l, quantity } : l)));
    }
    function clear() {
        setLines([]);
    }
    const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0), [lines]);
    const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
    return (<CartContext.Provider value={{ lines, addItem, removeItem, updateQuantity, clear, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>);
}
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx)
        throw new Error("useCart must be used within a CartProvider");
    return ctx;
}
