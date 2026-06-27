"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { ShoppingBag, Store, User as UserIcon, LogOut, Menu, X } from "lucide-react";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_, session) =>
      setUser(session?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
            <ShoppingBag className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-charcoal">
            Artisan<span className="text-brand-500">Market</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/browse" className="btn-ghost">Browse</Link>
          {user ? (
            <>
              <Link href="/dashboard/buyer" className="btn-ghost">
                <UserIcon className="h-4 w-4" /> Account
              </Link>
              <Link href="/dashboard/seller" className="btn-ghost">
                <Store className="h-4 w-4" /> My Shop
              </Link>
              <button onClick={handleSignOut} className="btn-ghost text-red-500 hover:text-red-600">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost">Sign in</Link>
              <Link href="/auth/signup" className="btn-primary text-sm py-2 px-5">
                Join free
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden btn-ghost"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-black/5 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link href="/browse" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>Browse</Link>
            {user ? (
              <>
                <Link href="/dashboard/buyer" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>Account</Link>
                <Link href="/dashboard/seller" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>My Shop</Link>
                <button onClick={handleSignOut} className="btn-ghost justify-start text-red-500">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link href="/auth/signup" className="btn-primary justify-start" onClick={() => setMenuOpen(false)}>Join free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
