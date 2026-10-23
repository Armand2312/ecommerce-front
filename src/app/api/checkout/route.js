import { mongooseConnect } from "@/lib/mongoose";
import { Order, ensureCheckoutIndex } from "@/models/Order";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";
import { getTestStripe } from "@/lib/stripe";
import { CheckoutError, validateCheckout, checkoutOrigin, createCheckout } from "@/lib/checkout.mjs";

export const runtime = "nodejs";

export async function POST(req) {
    const headers = { "Cache-Control": "no-store" };
    try {
        let body;
        try {
            if (!req.headers.get("content-type")?.includes("application/json")) throw new Error();
            const text = await req.text();
            if (text.length > 65536) throw new Error();
            body = JSON.parse(text);
        } catch { throw new CheckoutError(400, "Invalid JSON checkout request."); }
        const input = validateCheckout(body);
        const origin = checkoutOrigin(process.env.PUBLIC_URL);
        let stripe;
        try { stripe = getTestStripe(); }
        catch { throw new CheckoutError(503, "Stripe configuration error: a test secret key (sk_test_...) is required. Live payments are disabled."); }
        await mongooseConnect();
        await ensureCheckoutIndex();
        const url = await createCheckout({ input, origin, Order, Product, stripe });
        return NextResponse.json({ url }, { headers });
    } catch (error) {
        return NextResponse.json({ error: error instanceof CheckoutError ? error.message : "Unable to start checkout. Please retry the same attempt." },
            { status: error instanceof CheckoutError ? error.status : 503, headers });
    }
}
