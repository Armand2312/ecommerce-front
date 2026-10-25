import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
    }

    const productIds = body?.productIds;
    if (!Array.isArray(productIds) || productIds.length > 2000 ||
        !productIds.every(id => typeof id === "string" && /^[a-f0-9]{24}$/i.test(id))) {
        return NextResponse.json({ error: "Provide a valid list of product IDs." }, { status: 400 });
    }

    if (productIds.length === 0) return NextResponse.json({ products: [] });

    try {
        await mongooseConnect();
        const products = await Product.find({ _id: { $in: productIds } });
        return NextResponse.json({ products });
    } catch {
        return NextResponse.json({ error: "Unable to load your cart. Please try again." }, { status: 500 });
    }
}
