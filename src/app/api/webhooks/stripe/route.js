import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { getTestStripe } from "@/lib/stripe";
import { CheckoutError, processStripeEvent, verifyStripeEvent } from "@/lib/checkout.mjs";

export const runtime = "nodejs";

export async function POST(req) {
    let stripe;
    try { stripe = getTestStripe(); }
    catch { return NextResponse.json({ error: "Stripe test-mode configuration is unavailable." }, { status: 503 }); }
    if (!/^whsec_[A-Za-z0-9]+$/.test(process.env.WEBHOOK_SK || "")) {
        return NextResponse.json({ error: "Webhook signing secret is not configured." }, { status: 503 });
    }
    let event;
    try {
        const signature = req.headers.get("stripe-signature");
        const body = await req.text();
        event = verifyStripeEvent(stripe, body, signature, process.env.WEBHOOK_SK);
    } catch { return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 }); }
    try {
        if (event.livemode !== false) throw new CheckoutError(400, "Only test events are accepted.");
        if (!event.type.startsWith("checkout.session.")) return NextResponse.json({ received: true });
        await mongooseConnect();
        await processStripeEvent(event, { stripe, Order });
        return NextResponse.json({ received: true });
    } catch (error) {
        return NextResponse.json({ error: error instanceof CheckoutError ? error.message : "Unable to process webhook. Please retry." },
            { status: error instanceof CheckoutError ? error.status : 500 });
    }
}
