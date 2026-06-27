import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import type { ProductWithShop } from "@/types";
import { buildWhatsAppLink, formatPrice } from "@/lib/whatsapp";
import { MessageCircle, Store, Tag, ExternalLink } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("title, description")
    .eq("id", id)
    .single();

  return {
    title: data?.title ?? "Product",
    description: data?.description?.slice(0, 155),
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("*, shop:shops(*)")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!data) notFound();

  const product = data as ProductWithShop;
  const price = formatPrice(product.price, product.currency);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://artisanmarket.com";
  const productUrl = `${siteUrl}/product/${product.id}`;
  const waLink = buildWhatsAppLink(
    product.shop.whatsapp_number,
    product.title,
    price,
    productUrl
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-7xl text-charcoal/20">
              🖼️
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {/* Shop badge */}
          <span
            className="mb-4 inline-flex items-center gap-2 self-start rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700"
          >
            <Store className="h-3.5 w-3.5" />
            {product.shop.shop_name}
          </span>

          <h1 className="font-display text-3xl font-bold leading-tight text-charcoal">
            {product.title}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <Tag className="h-4 w-4 text-brand-500" />
            <span className="text-3xl font-bold text-brand-600">{price}</span>
          </div>

          <p className="mt-6 leading-relaxed text-charcoal/70">{product.description}</p>

          {/* WhatsApp CTA */}
          <div className="mt-8 rounded-2xl bg-green-50 p-5 ring-1 ring-green-200">
            <p className="mb-3 text-sm font-medium text-green-800">
              Like this item? Contact the seller directly on WhatsApp to arrange your purchase.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-green-500 px-6 py-4 text-base font-bold text-white transition-all hover:bg-green-600 active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
              Contact Seller on WhatsApp to Buy
              <ExternalLink className="h-4 w-4 opacity-70" />
            </a>
          </div>

          <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-xs text-charcoal/50">
            <p>💬 You'll be redirected to WhatsApp with a pre-filled message about this product.</p>
            <p className="mt-1">💳 Payment and delivery are arranged directly with the seller.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
