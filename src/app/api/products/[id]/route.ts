import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description, price, image_url, shopId } = await request.json();

    // Verify ownership
    const { data: shop } = await supabase
      .from("shops")
      .select("id")
      .eq("id", shopId)
      .eq("owner_id", user.id)
      .single();

    if (!shop) return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const { data, error } = await supabase
      .from("products")
      .update({
        title: title?.trim(),
        description: description?.trim(),
        price: typeof price === "number" ? price : undefined,
        image_url: image_url?.trim() || null,
      })
      .eq("id", id)
      .eq("shop_id", shopId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ product: data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Read shopId from query param instead of body (DELETE body is unreliable)
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get("shopId");

    if (!shopId) return NextResponse.json({ error: "shopId is required" }, { status: 400 });

    // Verify ownership
    const { data: shop } = await supabase
      .from("shops")
      .select("id")
      .eq("id", shopId)
      .eq("owner_id", user.id)
      .single();

    if (!shop) return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("shop_id", shopId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
