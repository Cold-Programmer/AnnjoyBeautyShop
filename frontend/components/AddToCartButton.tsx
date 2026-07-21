"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/data";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button onClick={handleClick} className="btn-primary w-full" aria-live="polite">
      {added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
