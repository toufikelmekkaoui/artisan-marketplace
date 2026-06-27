"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X } from "lucide-react";

interface Props {
  shopId: string;
  sellerId: string;
}

export function AddProductForm({ shopId, sellerId }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    setImageUrl(data.secure_url);
    setUploading(false);
  };

  const handleSubmit = async () => {
    setError("");
    if (!title.trim() || !description.trim() || !price) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopId,
        sellerId,
        title,
        description,
        price: parseFloat(price),
        imageUrl,
      }),
    });
    if (res.ok) {
      setSuccess(true);
      setTitle(""); setDescription(""); setPrice(""); setImageUrl("");
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? "Failed to add product.");
    }
    setLoading(false);
  };

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-4">
        <div>
          <label className="label">PRODUCT TITLE *</label>
          <input className="input-field" value={title}
            onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Handmade ceramic mug" />
        </div>
        <div>
          <label className="label">DESCRIPTION *</label>
          <textarea className="input-field min-h-[100px] resize-y" value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product..." />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">PRICE (USD) *</label>
            <input type="number" className="input-field" value={price}
              onChange={(e) => setPrice(e.target.value)} placeholder="0.00" min="0.01" step="0.01" />
          </div>
          <div>
            <label className="label">PRODUCT IMAGE</label>
            {imageUrl ? (
              <div className="relative">
                <img src={imageUrl} alt="Product" className="h-24 w-24 rounded-xl object-cover" />
                <button onClick={() => setImageUrl("")}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-charcoal/20 px-4 py-3 text-sm text-charcoal/50 hover:border-brand-400 hover:text-brand-500 transition-all">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            )}
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">Product added successfully!</p>}
        <div className="flex justify-end">
          <button onClick={handleSubmit} disabled={loading || uploading}
            className="btn-primary gap-2">
            <Plus className="h-4 w-4" />
            {loading ? "Adding..." : "Add product"}
          </button>
        </div>
      </div>
    </div>
  );
}