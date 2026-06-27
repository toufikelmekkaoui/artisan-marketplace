"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

interface Props {
  shopUrl: string;
}

export function ShopLinkBanner({ shopUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shopUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
        🔗 Your Shop Link
      </p>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1 rounded-xl border border-brand-200 bg-white px-3 py-2">
          <p className="truncate text-sm text-charcoal/70">{shopUrl}</p>
        </div>
        <button
          onClick={handleCopy}
          className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
            copied ? "bg-green-500 text-white" : "bg-brand-500 text-white hover:bg-brand-600"
          }`}
        >
          {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy</>}
        </button>
        <a
          href={shopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center justify-center rounded-xl border border-charcoal/15 bg-white p-2 text-charcoal/50 hover:text-charcoal"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}