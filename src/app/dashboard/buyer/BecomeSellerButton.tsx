"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";

export function BecomeSellerButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/user/become-seller", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Something went wrong");
      setLoading(false);
    } else {
      router.push("/dashboard/seller");
      router.refresh();
    }
  };

  return (
    <div className="mt-4">
      {error && (
        <p className="mb-3 text-sm text-red-600">{error}</p>
      )}
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="btn-primary gap-2"
      >
        <Store className="h-4 w-4" />
        {loading ? "Opening your shop…" : "Switch to Seller — it's free"}
      </button>
    </div>
  );
}
