"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Shop } from "@/types";
import { Save } from "lucide-react";

interface Props {
  userId: string;
  existingShop: Shop | null;
}

export function ShopSetupForm({ userId, existingShop }: Props) {
  const router = useRouter();
  const [shopName, setShopName] = useState(existingShop?.shop_name ?? "");
  const [description, setDescription] = useState(existingShop?.description ?? "");
  const [whatsapp, setWhatsapp] = useState(existingShop?.whatsapp_number ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/shops", {
      method: existingShop ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        shopId: existingShop?.id,
        shopName,
        description,
        whatsappNumber: whatsapp,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Something went wrong");
    } else {
      setSuccess(true);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <div className="flex flex-col gap-4">
        <div>
          <label className="label">Shop name *</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="input-field"
            placeholder="e.g. Layla's Ceramics"
            required
            maxLength={60}
          />
        </div>

        <div>
          <label className="label">Shop description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field min-h-[80px] resize-y"
            placeholder="Tell buyers a bit about your shop…"
            maxLength={300}
          />
        </div>

        <div>
          <label className="label">WhatsApp number (with country code) *</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
            className="input-field"
            placeholder="e.g. 966501234567"
            required
            pattern="\d{7,15}"
            title="Digits only, including country code (no + or spaces)"
          />
          <p className="mt-1 text-xs text-charcoal/40">Digits only. Include country code. e.g. 1 for US, 966 for Saudi Arabia.</p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}
        {success && (
          <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            ✓ Shop details saved successfully!
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-primary gap-2">
            <Save className="h-4 w-4" />
            {loading ? "Saving…" : existingShop ? "Update shop" : "Create shop"}
          </button>
        </div>
      </div>
    </form>
  );
}
