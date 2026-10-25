import { NextResponse } from "next/server";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";

export async function GET(req) {
    const id = req.nextUrl.searchParams.get("id");
    if (id !== null && !/^[a-f0-9]{24}$/i.test(id)) {
        return NextResponse.json({ error: "Invalid product ID." }, { status: 400 });
    }

    try {
        await mongooseConnect();
        if (id !== null) {
            const product = await Product.findById(id);
            if (!product) {
                return NextResponse.json({ error: "Product not found." }, { status: 404 });
            }
            return NextResponse.json({ product });
        }

        const options = { sort: { _id: -1 } };
        if (req.nextUrl.searchParams.get("all") !== "true") options.limit = 10;
        const products = await Product.find({}, null, options);
        return NextResponse.json({ products });
    } catch {
        return NextResponse.json({ error: "Unable to load products. Please try again." }, { status: 500 });
    }
}
