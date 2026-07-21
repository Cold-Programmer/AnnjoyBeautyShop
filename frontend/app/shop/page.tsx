"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { Product } from "@/lib/data";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const GENDERS = ["ALL", "MEN", "WOMEN", "UNISEX", "KIDS"] as const;

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  imageUrl: string | null;
  gender: string;
  category: { name: string; slug: string };
}

function toProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category.name,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? undefined,
    stock: p.stock,
    rating: 4.6, // no review-aggregate endpoint yet — see README
    reviewCount: 0,
    image: p.imageUrl || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
  };
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState<(typeof GENDERS)[number]>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (gender !== "ALL") params.set("gender", gender);

    setLoading(true);
    fetch(`${API}/api/products?${params.toString()}`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          setNeedsLogin(true);
          return;
        }
        if (!res.ok) throw new Error();
        const data = await res.json();
        const items: Product[] = (data.items || []).map(toProduct);
        setProducts(items);
        setCategories((prev) => (prev.length ? prev : Array.from(new Set(items.map((p) => p.category)))));
      })
      .catch(() => setError("Could not load products from the server. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [category, gender]);

  const categoryOptions = useMemo(() => ["", ...categories], [categories]);

  if (needsLogin) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-3xl">Log in to shop</h1>
        <p className="mt-3 text-ink/60">Create an account or log in to browse and buy products.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/login" className="btn-primary">Log in</Link>
          <Link href="/register" className="btn-secondary">Create account</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="eyebrow">Beauty & cosmetics</p>
      <h1 className="mt-2 text-4xl">Shop</h1>
      <p className="mt-3 max-w-xl text-ink/70">
        Hair care, skin care, makeup, perfumes and more — for men, women, and kids alike.
      </p>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
                gender === g ? "border-rosegold-dark bg-rosegold-dark/10 text-rosegold-dark" : "border-ink/15 text-ink/60 hover:border-rosegold"
              }`}
            >
              {g === "ALL" ? "All" : g.charAt(0) + g.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="ml-auto rounded-full border border-ink/15 px-4 py-1.5 text-xs focus:border-rosegold focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-6 text-sm text-ink/50">Loading products…</p>}

      {!loading && !error && products.length === 0 && (
        <p className="mt-10 text-center text-ink/50">No products match these filters yet.</p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="card overflow-hidden bg-white">
            <div className="relative h-48 w-full">
              <Image src={p.image} alt={p.name} fill className="object-cover" />
              {p.compareAtPrice && (
                <span className="absolute left-3 top-3 rounded-full bg-rosegold-dark px-2.5 py-1 text-[11px] font-semibold text-white">
                  Sale
                </span>
              )}
            </div>
            <div className="p-5">
              <p className="eyebrow">{p.category}</p>
              <h3 className="mt-1 text-base">{p.name}</h3>
              <p className="mt-1 text-xs text-ink/50">{p.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-medium">KES {p.price.toLocaleString()}</span>
                {p.compareAtPrice && (
                  <span className="text-xs text-ink/40 line-through">KES {p.compareAtPrice.toLocaleString()}</span>
                )}
              </div>
              <p className={`mt-1 text-xs ${p.stock > 0 ? "text-green-700" : "text-red-600"}`}>
                {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
              </p>
              <div className="mt-4">
                <AddToCartButton product={p} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
