import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { shopName, description, whatsappNumber } = await request.json();

    if (!shopName?.trim()) {
      return NextResponse.json({ error: "Shop name is required" }, { status: 400 });
    }
    if (!whatsappNumber?.trim()) {
      return NextResponse.json({ error: "WhatsApp number is required" }, { status: 400 });
    }

    // Check user is a seller
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "seller") {
      return NextResponse.json({ error: "You must be a seller to create a shop" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("shops")
      .insert({
        owner_id: user.id,
        shop_name: shopName.trim(),
        description: description?.trim() || null,
        whatsapp_number: whatsappNumber.trim().replace(/\D/g, ""),
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "You already have a shop" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ shop: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { shopId, shopName, description, whatsappNumber } = await request.json();

    if (!shopId) return NextResponse.json({ error: "Shop ID required" }, { status: 400 });

    const { data, error } = await supabase
      .from("shops")
      .update({
        shop_name: shopName?.trim(),
        description: description?.trim() || null,
        whatsapp_number: whatsappNumber?.trim().replace(/\D/g, ""),
      })
      .eq("id", shopId)
      .eq("owner_id", user.id) // RLS safety
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ shop: data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
