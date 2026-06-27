"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/whatsapp";
import { Pencil, Trash2, X, Save } from "lucide-react";

interface Props {
  products: Product[];
  shopId: string;
}

export function ProductList({ products, shopId }: Props) {
  const router = useRouter();
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-black/10 py-14 text-center">
        <div className="text-4xl">📦</div>
        <p className="font-semibold text-charcoal/60">No products yet</p>
        <p className="text-sm text-charcoal/40">Add your first product using the form above.</p>
      </div>
    );
  }

  const startEdit = (p: Product) => {
    setEditId(p.id);
    setEditData({ title: p.title, description: p.description, price: p.price, image_url: p.image_url ?? "" });
  };

  const cancelEdit = () => { setEditId(null); setEditData({}); };

  const saveEdit = async (productId: string) => {
    setLoading(productId);
    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editData, shopId }),
    });
    if (res.ok) { setEditId(null); router.refresh(); }
    setLoading(null);
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setLoading(productId);
    // Pass shopId as query param — DELETE body is unreliable across environments
    await fetch(`/api/products/${productId}?shopId=${encodeURIComponent(shopId)}`, {
      method: "DELETE",
    });
    router.refresh();
    setLoading(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {products.map((p) => (
        <div key={p.id} className="card overflow-hidden">
          {editId === p.id ? (
            /* ── Edit mode ── */
            <div className="p-5">
              <div className="flex flex-col gap-3">
                <input
                  className="input-field"
                  value={editData.title ?? ""}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  placeholder="Title"
                />
                <textarea
                  className="input-field min-h-[80px] resize-y"
                  value={editData.description ?? ""}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Description"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="number"
                    className="input-field"
                    value={editData.price ?? ""}
                    onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                    placeholder="Price"
                    min="0.01"
                    step="0.01"
                  />
                  <input
                    type="url"
                    className="input-field"
                    value={editData.image_url ?? ""}
                    onChange={(e) => setEditData({ ...editData, image_url: e.target.value })}
                    placeholder="Image URL"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={cancelEdit} className="btn-ghost gap-1">
                    <X className="h-4 w-4" /> Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(p.id)}
                    disabled={loading === p.id}
                    className="btn-primary gap-1 py-2 text-sm"
                  >
                    <Save className="h-4 w-4" />
                    {loading === p.id ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── View mode ── */
            <div className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {p.image_url ? (
                  <Image src={p.image_url} alt={p.title} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xl">🖼️</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.title}</p>
                <p className="text-sm text-brand-600 font-bold">{formatPrice(p.price, p.currency)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => startEdit(p)}
                  className="btn-ghost p-2 text-charcoal/50"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteProduct(p.id)}
                  disabled={loading === p.id}
                  className="btn-ghost p-2 text-red-400 hover:text-red-600"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
