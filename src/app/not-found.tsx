import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-6xl">🔍</div>
      <h1 className="font-display text-4xl font-bold">Page not found</h1>
      <p className="max-w-sm text-charcoal/50">
        This page doesn't exist or the item may have been removed.
      </p>
      <Link href="/" className="btn-primary mt-2">Go home</Link>
    </div>
  );
}
