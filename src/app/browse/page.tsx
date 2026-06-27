import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductWithShop } from "@/types";
import Link from "next/link";

export const metadata = { title: "Browse" };

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() ?? "";

  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, shop:shops(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data } = await query;
  const products = (data as ProductWithShop[] | null) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold">
          {q ? `Results for "${q}"` : "Browse everything"}
        </h1>
        <p className="mt-2 text-charcoal/50">
          {products.length} {products.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Search */}
      <form method="GET" className="mb-10">
        <div className="flex gap-3">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search products…"
            className="input-field max-w-sm"
          />
          <button type="submit" className="btn-primary px-6 py-3">Search</button>
          {q && (
            <Link href="/browse" className="btn-secondary px-6 py-3">Clear</Link>
          )}
        </div>
      </form>

      {/* Grid or empty */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-black/10 py-24 text-center">
          <div className="text-5xl">{q ? "🔍" : "🛍️"}</div>
          <h3 className="font-display text-xl font-bold text-charcoal/70">
            {q ? "No products match your search" : "No products listed yet"}
          </h3>
          <p className="max-w-sm text-sm text-charcoal/40">
            {q
              ? "Try a different search term or browse everything."
              : "Be the first seller! Open a free shop and start listing."}
          </p>
          {q ? (
            <Link href="/browse" className="btn-secondary mt-2">Browse all</Link>
          ) : (
            <Link href="/auth/signup" className="btn-primary mt-2">Open your shop</Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
