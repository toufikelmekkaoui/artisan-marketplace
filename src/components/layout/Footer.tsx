import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500">
              <ShoppingBag className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-charcoal">
              Artisan<span className="text-brand-500">Market</span>
            </span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-charcoal/50">
            <Link href="/browse" className="hover:text-charcoal transition-colors">Browse</Link>
            <Link href="/auth/signup" className="hover:text-charcoal transition-colors">Sell on Artisan</Link>
          </nav>

          <p className="text-xs text-charcoal/40">
            © {new Date().getFullYear()} ArtisanMarket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
