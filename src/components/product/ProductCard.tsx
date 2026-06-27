import Link from "next/link";
import Image from "next/image";
import type { ProductWithShop } from "@/types";
import { formatPrice } from "@/lib/whatsapp";
import { Store } from "lucide-react";

interface Props {
  product: ProductWithShop;
}

export function ProductCard({ product }: Props) {
  const price = formatPrice(product.price, product.currency);

  return (
    <Link href={`/product/${product.id}`} className="product-card group block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-charcoal/20">
            🖼️
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="mb-1 flex items-center gap-1 text-xs text-charcoal/40">
          <Store className="h-3 w-3" />
          {product.shop?.shop_name ?? "Shop"}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold text-charcoal leading-snug">
          {product.title}
        </h3>
        <p className="mt-2 text-base font-bold text-brand-600">{price}</p>
      </div>
    </Link>
  );
}
