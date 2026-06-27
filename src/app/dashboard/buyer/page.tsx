import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BecomeSellerButton } from "./BecomeSellerButton";
import { Store, ShoppingBag, ArrowRight } from "lucide-react";

export const metadata = { title: "My Account" };

export default async function BuyerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isSeller = profile?.role === "seller";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold">My Account</h1>
      <p className="mt-1 text-charcoal/50">Welcome back, {profile?.full_name ?? user.email}</p>

      <div className="mt-8 flex flex-col gap-4">
        {/* Profile card */}
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Profile details</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-charcoal/50">Name</dt>
              <dd className="font-medium">{profile?.full_name ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal/50">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal/50">Account type</dt>
              <dd>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isSeller ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-charcoal/70"}`}>
                  {isSeller ? "Seller" : "Buyer"}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Seller CTA or link */}
        {isSeller ? (
          <div className="card flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                <Store className="h-5 w-5 text-brand-500" />
              </div>
              <div>
                <p className="font-semibold">Seller account active</p>
                <p className="text-sm text-charcoal/50">Manage your shop and products</p>
              </div>
            </div>
            <Link href="/dashboard/seller" className="btn-primary gap-1 py-2.5 text-sm">
              Go to shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-brand-50 to-orange-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100">
                  <ShoppingBag className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">Open your shop</h3>
                  <p className="mt-1 text-sm text-charcoal/60">
                    Start selling in minutes. List your products and connect buyers directly via WhatsApp. 100% free.
                  </p>
                  <BecomeSellerButton userId={user.id} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Browse link */}
        <Link href="/browse" className="btn-secondary justify-center py-3.5">
          Browse products
        </Link>
      </div>
    </div>
  );
}
