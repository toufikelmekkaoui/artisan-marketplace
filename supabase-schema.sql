-- ============================================================
--  ArtisanMarket — Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── 1. profiles ─────────────────────────────────────────────
-- Mirrors auth.users; role defaults to 'buyer'.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'buyer' check (role in ('buyer', 'seller')),
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. shops ────────────────────────────────────────────────
create table if not exists public.shops (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid not null references public.profiles(id) on delete cascade,
  shop_name        text not null,
  description      text,
  whatsapp_number  text not null,   -- digits only, e.g. "966501234567"
  created_at       timestamptz not null default now(),
  unique(owner_id)                  -- one shop per seller
);

-- ── 3. products ─────────────────────────────────────────────
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  shop_id      uuid not null references public.shops(id) on delete cascade,
  seller_id    uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  description  text not null,
  price        numeric(10, 2) not null check (price > 0),
  currency     text not null default 'USD',
  image_url    text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Index for fast browsing queries
create index if not exists products_is_active_created_at
  on public.products (is_active, created_at desc);

-- ── 4. Row Level Security (RLS) ─────────────────────────────

-- profiles
alter table public.profiles enable row level security;

create policy "Users can view all profiles"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- shops
alter table public.shops enable row level security;

create policy "Anyone can view shops"
  on public.shops for select using (true);

create policy "Sellers can insert own shop"
  on public.shops for insert
  with check (auth.uid() = owner_id);

create policy "Sellers can update own shop"
  on public.shops for update using (auth.uid() = owner_id);

create policy "Sellers can delete own shop"
  on public.shops for delete using (auth.uid() = owner_id);

-- products
alter table public.products enable row level security;

create policy "Anyone can view active products or own products"
  on public.products for select
  using (is_active = true or auth.uid() = seller_id);

create policy "Sellers can insert into own shop"
  on public.products for insert
  with check (auth.uid() = seller_id);

create policy "Sellers can update own products"
  on public.products for update using (auth.uid() = seller_id);

create policy "Sellers can delete own products"
  on public.products for delete using (auth.uid() = seller_id);

-- ── 5. Helper: upsert role to 'seller' (called by API) ──────
-- The API route updates profiles directly via the anon key;
-- RLS above permits it because uid() = id.
-- No extra function needed.

-- ── Done ────────────────────────────────────────────────────
-- Your database is ready. No seed data — the marketplace
-- starts completely empty, as required.
