# ArtisanMarket MVP

A multi-vendor marketplace where buyers browse products and contact sellers directly via WhatsApp. No payment gateway required.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Backend/DB | Supabase (PostgreSQL + Auth + RLS) |
| Hosting | Vercel (frontend) + Supabase (backend) |
| Language | TypeScript |

---

## File Tree

```
artisan-marketplace/
├── supabase-schema.sql          ← Run this in Supabase SQL editor FIRST
├── .env.local.example           ← Copy to .env.local and fill in
│
└── src/
    ├── middleware.ts             ← Session refresh middleware
    ├── types/index.ts            ← TypeScript types
    │
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts         ← Browser Supabase client
    │   │   ├── server.ts         ← Server Supabase client
    │   │   └── middleware.ts     ← Middleware Supabase client
    │   └── whatsapp.ts           ← WhatsApp link builder + price formatter
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx        ← Responsive nav with auth state
    │   │   └── Footer.tsx
    │   └── product/
    │       └── ProductCard.tsx   ← Product grid card
    │
    └── app/
        ├── layout.tsx            ← Root layout
        ├── page.tsx              ← Homepage (hero + recent listings)
        ├── not-found.tsx         ← 404 page
        │
        ├── auth/
        │   ├── login/page.tsx    ← Sign-in form
        │   ├── signup/page.tsx   ← Registration form (role = buyer)
        │   └── callback/route.ts ← Email confirmation handler
        │
        ├── browse/
        │   └── page.tsx          ← Browse + search all products
        │
        ├── product/
        │   └── [id]/page.tsx     ← Product detail + WhatsApp CTA
        │
        ├── dashboard/
        │   ├── buyer/
        │   │   ├── page.tsx              ← Buyer account + "Become Seller" CTA
        │   │   └── BecomeSellerButton.tsx
        │   └── seller/
        │       ├── page.tsx              ← Seller dashboard
        │       ├── ShopSetupForm.tsx     ← Create/edit shop details
        │       ├── AddProductForm.tsx    ← Add new product
        │       └── ProductList.tsx       ← Edit/delete products
        │
        └── api/
            ├── user/
            │   └── become-seller/route.ts  ← POST: upgrade role to seller
            ├── shops/
            │   └── route.ts                ← POST/PUT: create or update shop
            └── products/
                ├── route.ts                ← POST: create product
                └── [id]/route.ts           ← PUT/DELETE: edit or remove product
```

---

## Database Schema

```
profiles          shops             products
─────────────     ─────────────     ─────────────
id (uuid PK)      id (uuid PK)      id (uuid PK)
email             owner_id → prof   shop_id → shops
full_name         shop_name         seller_id → prof
role (buyer|      description       title
  seller)         whatsapp_number   description
created_at        created_at        price
                                    currency
                                    image_url
                                    is_active
                                    created_at
```

Row Level Security ensures:
- Anyone can **read** active products and shops
- Only the owner can **write** to their own shop/products

---

## Setup Instructions

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Open **SQL Editor** → paste the contents of `supabase-schema.sql` → Run
3. Go to **Project Settings → API** and copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Configure environment

```bash
cp .env.local.example .env.local
# Edit .env.local and fill in your Supabase credentials
```

### 3. Configure Supabase Auth

In Supabase Dashboard → **Authentication → URL Configuration**:
- Site URL: `http://localhost:3000` (dev) or your production URL
- Redirect URLs: add `http://localhost:3000/auth/callback`

### 4. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## User Flows

### Buyer flow
1. Sign up → automatically registered as **Buyer**
2. Browse products at `/browse`
3. Click a product → product detail page
4. Click **"Contact Seller on WhatsApp to Buy"** → WhatsApp opens with pre-filled message

### Seller flow
1. Sign up (or sign in as existing buyer)
2. Go to **Account** dashboard
3. Click **"Switch to Seller"** → role updated to `seller`
4. Go to **My Shop** → fill in shop name + WhatsApp number
5. Add products (title, description, price, image URL)
6. Edit or delete products anytime

### WhatsApp message format

```
Hello! I am interested in buying your product:

🛍️ *[Product Title]*
💰 Price: $[XX.XX]
🔗 https://yoursite.com/product/[id]

Is it still available?
```

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# NEXT_PUBLIC_SITE_URL (your production URL)
```

---

## Roadmap (post-MVP)

- [ ] Image upload (Supabase Storage or Cloudinary)
- [ ] Product categories/tags
- [ ] Shop public pages (`/shop/[id]`)
- [ ] Search with filters (price range, category)
- [ ] Seller analytics (views per product)
- [ ] Favorites / wishlist for buyers
