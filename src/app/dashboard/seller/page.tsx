import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Product, Shop } from "@/types";
import { ShopSetupForm } from "./ShopSetupForm";
import { ProductList } from "./ProductList";
import { AddProductForm } from "./AddProductForm";
import { Store, Package } from "lucide-react";
import { Copy } from "lucide-react";
import { ShopLinkBanner } from "./ShopLinkBanner";

export const metadata = { title: "My Shop" };

export default async function SellerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "seller") redirect("/dashboard/buyer");

  const { data: shop } = await supabase
    .from("shops").select("*").eq("owner_id", user.id).maybeSingle();

  const { data: products } = shop
    ? await supabase.from("products").select("*")
        .eq("shop_id", shop.id).order("created_at", { ascending: false })
    : { data: [] };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
          <Store className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">My Shop</h1>
          <p className="text-sm text-charcoal/50">
            {shop ? shop.shop_name : "Set up your shop to start selling"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        {shop && <ShopLinkBanner shopUrl={`${siteUrl}/browse?shop=${shop.id}`} />}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Store className="h-4 w-4 text-charcoal/40" />
            <h2 className="font-semibold">Shop details</h2>
          </div>
          <ShopSetupForm userId={user.id} existingShop={shop as Shop | null} />
        </section>
        {shop && (
          <>
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-charcoal/40" />
                <h2 className="font-semibold">Add a product</h2>
              </div>
              <AddProductForm shopId={shop.id} sellerId={user.id} />
            </section>
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-charcoal/40" />
                <h2 className="font-semibold">Your listings ({products?.length ?? 0})</h2>
              </div>
              <ProductList
                products={(products as Product[]) ?? []}
                shopId={shop.id}
                siteUrl={siteUrl}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}