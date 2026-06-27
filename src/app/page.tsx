import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductWithShop } from "@/types";
import { ArrowRight, Sparkles, Shield, MessageCircle } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, shop:shops(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  const recent = (products as ProductWithShop[] | null) ?? [];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-cream to-orange-50 px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
            Handcrafted &amp; Independent
          </p>
          <h1 className="font-display text-5xl font-bold leading-tight text-charcoal sm:text-6xl">
            Discover things<br />
            <span className="text-brand-500">made with care.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-charcoal/60">
            A marketplace built on direct connection — browse unique products
            and contact sellers instantly on WhatsApp.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/browse" className="btn-primary gap-2 px-8 py-3.5 text-base">
              Start browsing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/auth/signup" className="btn-secondary gap-2 px-8 py-3.5 text-base">
              Open a free shop
            </Link>
          </div>
        </div>

        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />
      </section>

      {/* ── Value props ── */}
      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          {[
            {
              icon: <Sparkles className="h-6 w-6 text-brand-500" />,
              title: "Unique items",
              text: "Handmade, vintage, and custom — things you won't find anywhere else.",
            },
            {
              icon: <MessageCircle className="h-6 w-6 text-brand-500" />,
              title: "Direct contact",
              text: "Chat with sellers directly on WhatsApp. No middleman, no friction.",
            },
            {
              icon: <Shield className="h-6 w-6 text-brand-500" />,
              title: "Free to use",
              text: "No listing fees, no commissions. The marketplace is yours to use freely.",
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50">
                {item.icon}
              </div>
              <h3 className="font-display text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-charcoal/60">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recent listings ── */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="label">Fresh arrivals</p>
              <h2 className="font-display text-3xl font-bold">Latest listings</h2>
            </div>
            <Link href="/browse" className="btn-ghost hidden sm:flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {recent.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-center sm:hidden">
            <Link href="/browse" className="btn-secondary">View all listings</Link>
          </div>
        </div>
      </section>

      {/* ── Seller CTA ── */}
      <section className="mx-4 mb-16 overflow-hidden rounded-3xl bg-charcoal px-8 py-14 text-center sm:mx-6">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Ready to start selling?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/60">
          Create your shop for free in minutes. List your products, share your
          WhatsApp, and start receiving buyers directly.
        </p>
        <Link href="/auth/signup" className="btn-primary mt-8 bg-brand-400 hover:bg-brand-500 px-8 py-3.5 text-base">
          Open your shop — it's free
        </Link>
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-black/10 py-24 text-center">
      <div className="text-5xl">🛍️</div>
      <h3 className="font-display text-xl font-bold text-charcoal/70">No listings yet</h3>
      <p className="max-w-sm text-sm text-charcoal/40">
        Be the first! Open a free shop and add your products to get the marketplace started.
      </p>
      <Link href="/auth/signup" className="btn-primary mt-2">Open your shop</Link>
    </div>
  );
}
