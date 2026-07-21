"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { lines, updateQuantity, removeItem, subtotal, clear } = useCart();
  const shipping = subtotal > 0 ? 200 : 0;
  const total = subtotal + shipping;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="text-3xl">Your cart is empty</h1>
        <p className="mt-3 text-ink/60">Browse the shop and add something you'll love.</p>
        <Link href="/shop" className="btn-primary mt-8 inline-flex">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="text-3xl">Your cart</h1>

      <div className="mt-8 divide-y divide-ink/10 rounded-xl2 border border-ink/10 bg-white">
        {lines.map((l) => (
          <div key={l.product.slug} className="flex items-center gap-4 p-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
              <Image src={l.product.image} alt={l.product.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{l.product.name}</p>
              <p className="text-sm text-ink/50">KES {l.product.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(l.product.slug, l.quantity - 1)}
                className="h-8 w-8 rounded-full border border-ink/15 text-sm hover:border-rosegold"
                aria-label={`Decrease quantity of ${l.product.name}`}
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{l.quantity}</span>
              <button
                onClick={() => updateQuantity(l.product.slug, l.quantity + 1)}
                className="h-8 w-8 rounded-full border border-ink/15 text-sm hover:border-rosegold"
                aria-label={`Increase quantity of ${l.product.name}`}
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-medium">KES {(l.product.price * l.quantity).toLocaleString()}</p>
            <button
              onClick={() => removeItem(l.product.slug)}
              className="ml-2 text-xs text-ink/40 hover:text-rosegold-dark"
              aria-label={`Remove ${l.product.name}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 ml-auto max-w-sm space-y-2 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>KES {shipping.toLocaleString()}</span></div>
        <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-semibold">
          <span>Total</span><span>KES {total.toLocaleString()}</span>
        </div>
        <div className="flex gap-3 pt-4">
          <button onClick={clear} className="btn-secondary flex-1">Clear cart</button>
          <Link href="/checkout" className="btn-primary flex-1 text-center">Checkout</Link>
        </div>
      </div>
    </div>
  );
}
