import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { getTestStripe } from "@/lib/stripe";
import { CheckoutError, paymentStatus } from "@/lib/checkout.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
    const headers = { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer" };
    const id = req.nextUrl.searchParams.get("session_id");
    const attemptId = req.nextUrl.searchParams.get("attempt_id");
    if (id ? !/^cs_test_[A-Za-z0-9]{1,255}$/.test(id) : !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(attemptId || "")) {
        return NextResponse.json({ error: "Invalid test session." }, { status: 400, headers });
    }
    let stripe;
    try { stripe = getTestStripe(); }
    catch { return NextResponse.json({ error: "Stripe test-mode configuration is unavailable." }, { status: 503, headers }); }
    try {
        let order;
        if (!id) {
            await mongooseConnect();
            order = await Order.findOne({ checkoutAttemptId: attemptId.toLowerCase() });
            if (!order?.stripeSessionId) throw new CheckoutError(404, "Payment session not found.");
        }
        const session = await stripe.checkout.sessions.retrieve(id || order.stripeSessionId);
        if (!/^[a-f0-9]{24}$/i.test(session.metadata?.orderId || "")) throw new CheckoutError(404, "Payment session not found.");
        await mongooseConnect();
        order ||= await Order.findById(session.metadata.orderId);
        if (!order || !order.checkoutAttemptId) throw new CheckoutError(404, "Payment session not found.");
        return NextResponse.json({ status: paymentStatus(session, order) }, { headers });
    } catch (error) {
        const status = error instanceof CheckoutError ? error.status : error.code === "resource_missing" ? 404 : 503;
        return NextResponse.json({ error: status === 404 ? "Payment session not found." : "Unable to verify payment. Please try again." }, { status, headers });
    }
}
