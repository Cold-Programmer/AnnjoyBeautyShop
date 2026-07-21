"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  gender: string;
  isActive: boolean;
  category: { name: string };
}

const emptyForm = { name: "", slug: "", description: "", price: "", stock: "", categoryId: "", gender: "UNISEX", imageUrl: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/products?limit=100`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts(data.items);
    } catch {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleFileUpload(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(`${API}/api/uploads`, { method: "POST", credentials: "include", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForm((f) => ({ ...f, imageUrl: data.url }));
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // NOTE: this demo form needs a real categoryId — see README for the
      // categories-management endpoint that isn't built yet. Until then,
      // create products via `npx prisma studio` or extend this form with
      // a category picker sourced from a GET /api/products (categories
      // are embedded per-product, not exposed as their own list endpoint yet).
      const res = await fetch(`${API}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForm(emptyForm);
      await load();
    } catch (err: any) {
      setError(err.message || "Could not create product.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`${API}/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive: !isActive }),
    });
    await load();
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="eyebrow">Admin / Staff</p>
      <h1 className="mt-2 text-4xl">Products</h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="card p-6">
          <h2 className="text-lg">Add product</h2>
          <form onSubmit={handleCreate} className="mt-4 space-y-3">
            <input required placeholder="Name" value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" />
            <input required placeholder="Slug (url-friendly)" value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" />
            <textarea required placeholder="Description" rows={2} value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" placeholder="Price (KES)" value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="rounded-lg border border-ink/15 px-3 py-2 text-sm" />
              <input required type="number" placeholder="Stock" value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                className="rounded-lg border border-ink/15 px-3 py-2 text-sm" />
            </div>
            <input required placeholder="Category ID (see note below)" value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" />
            <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm">
              {["UNISEX", "MEN", "WOMEN", "KIDS"].map((g) => <option key={g} value={g}>{g}</option>)}
            </select>

            {/* Dual image input — URL or real file upload, per requirement */}
            <div>
              <div className="flex gap-2 text-xs">
                <button type="button" onClick={() => setImageMode("url")}
                  className={`rounded-full border px-3 py-1 ${imageMode === "url" ? "border-rosegold-dark text-rosegold-dark" : "border-ink/15"}`}>
                  Image URL
                </button>
                <button type="button" onClick={() => setImageMode("upload")}
                  className={`rounded-full border px-3 py-1 ${imageMode === "upload" ? "border-rosegold-dark text-rosegold-dark" : "border-ink/15"}`}>
                  Upload from device
                </button>
              </div>
              {imageMode === "url" ? (
                <input placeholder="https://..." value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" />
              ) : (
                <input type="file" accept="image/*" disabled={uploading}
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="mt-2 w-full text-xs" />
              )}
              {form.imageUrl && <p className="mt-1 truncate text-xs text-ink/40">{form.imageUrl}</p>}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={saving || uploading} className="btn-primary w-full">
              {saving ? "Saving…" : "Add product"}
            </button>
          </form>
          <p className="mt-3 text-xs text-ink/40">
            Category IDs come from your seeded ProductCategory rows — run <code>npx prisma studio</code> to
            copy one, or extend this form with a live category dropdown (a GET /api/product-categories list
            endpoint would be the next natural addition).
          </p>
        </div>

        <div className="card overflow-x-auto">
          {loading ? (
            <p className="p-6 text-sm text-ink/50">Loading…</p>
          ) : (
            <table className="w-full min-w-[500px] text-sm">
              <thead className="border-b border-ink/10 text-left text-xs uppercase text-ink/50">
                <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">{p.name}<p className="text-xs text-ink/40">{p.category.name} · {p.gender}</p></td>
                    <td className="px-4 py-3">KES {p.price.toLocaleString()}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(p.id, p.isActive)}
                        className={`rounded-full px-2 py-1 text-xs ${p.isActive ? "bg-green-100 text-green-700" : "bg-ink/10 text-ink/50"}`}>
                        {p.isActive ? "Active" : "Hidden"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
