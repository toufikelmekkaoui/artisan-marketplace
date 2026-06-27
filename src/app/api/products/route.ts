import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { shopId, title, description, price, imageUrl } = await request.json();

    if (!shopId || !title?.trim() || !description?.trim() || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 });
    }

    // Verify the shop belongs to this user
    const { data: shop } = await supabase
      .from("shops")
      .select("id")
      .eq("id", shopId)
      .eq("owner_id", user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ error: "Shop not found or access denied" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        shop_id: shopId,
        seller_id: user.id,
        title: title.trim(),
        description: description.trim(),
        price,
        currency: "USD",
        image_url: imageUrl || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ product: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
