import { createHash } from "node:crypto";

export class CheckoutError extends Error {
    constructor(status, message) { super(message); this.status = status; }
}

export function validateCheckout(body) {
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new CheckoutError(400, "Invalid checkout request.");
    const customer = {};
    for (const field of ["fullname", "email", "phoneNumber", "city", "postCode", "address", "country"]) {
        if (typeof body[field] !== "string" || !body[field].trim() || body[field].length > 254) {
            throw new CheckoutError(400, "Please provide valid contact and address details.");
        }
        customer[field] = body[field].trim();
    }
    customer.email = customer.email.toLowerCase();
    const phoneDigits = customer.phoneNumber.replace(/\D/g, "").length;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) || !/^\+?[\d ()-]{5,32}$/.test(customer.phoneNumber) || phoneDigits < 5 || phoneDigits > 15) {
        throw new CheckoutError(400, "Please provide a valid email and phone number.");
    }
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.attemptId || "")) {
        throw new CheckoutError(400, "Invalid checkout attempt. Please try again.");
    }
    if (typeof body.cartProducts !== "string" || body.cartProducts.length > 50000) throw new CheckoutError(400, "Invalid cart.");
    const counts = new Map();
    for (const value of body.cartProducts.split(",")) {
        if (!/^[a-f0-9]{24}$/i.test(value)) throw new CheckoutError(400, "Invalid product ID.");
        const id = value.toLowerCase();
        counts.set(id, (counts.get(id) || 0) + 1);
        if (counts.get(id) > 20) throw new CheckoutError(400, "Maximum quantity is 20 per product.");
    }
    if (counts.size > 100) throw new CheckoutError(400, "Cart contains too many products.");
    const items = [...counts].sort(([a], [b]) => a.localeCompare(b));
    const requestHash = createHash("sha256").update(JSON.stringify({ customer, items })).digest("hex");
    return { customer, items, requestHash, attemptId: body.attemptId.toLowerCase() };
}

export function toPence(price) {
    // Reject fractional pennies instead of silently rounding stored catalog data.
    const text = String(price);
    if (typeof price !== "number" || !/^\d+(?:\.\d{1,2})?$/.test(text)) throw new CheckoutError(422, "A product has an invalid price.");
    const [pounds, fraction = ""] = text.split(".");
    const amount = Number(pounds) * 100 + Number(fraction.padEnd(2, "0"));
    if (!Number.isSafeInteger(amount) || amount <= 0 || amount > 99999999) throw new CheckoutError(422, "A product has an invalid price.");
    return amount;
}

export function priceCart(items, products) {
    const byId = new Map(products.map(p => [String(p._id), p]));
    let total = 0;
    const line_items = items.map(([id, quantity]) => {
        const product = byId.get(id);
        if (!product) throw new CheckoutError(409, "A product is no longer available. Please update your cart.");
        const unit_amount = toPence(product.price);
        total += unit_amount * quantity;
        return { quantity, price_data: { currency: "gbp", product_data: { name: product.title }, unit_amount } };
    });
    if (!Number.isSafeInteger(total) || total < 30 || total > 99999999) throw new CheckoutError(422, "Cart total is outside the supported payment range.");
    return { line_items, total };
}

export function checkoutOrigin(value) {
    try {
        const url = new URL(value);
        if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== "/") throw new Error();
        if (url.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(url.hostname)) throw new Error();
        return url.origin;
    } catch { throw new CheckoutError(503, "Checkout configuration error: set PUBLIC_URL to the storefront origin."); }
}

export async function createCheckout({ input, origin, Order, Product, stripe, now = Date.now() }) {
    let order = await Order.findOne({ checkoutAttemptId: input.attemptId });
    if (!order) {
        const products = await Product.find({ _id: { $in: input.items.map(([id]) => id) } });
        const priced = priceCart(input.items, products);
        try {
            order = await Order.create({ ...input.customer, line_items: priced.line_items, totalAmount: priced.total,
                currency: "gbp", paid: false, checkoutAttemptId: input.attemptId, requestHash: input.requestHash,
                checkoutOrigin: origin, checkoutStartedAt: new Date(now) });
        } catch (error) {
            if (error.code !== 11000) throw error;
            order = await Order.findOne({ checkoutAttemptId: input.attemptId });
            if (!order) throw error;
        }
    }
    if (order.requestHash !== input.requestHash) throw new CheckoutError(409, "This checkout attempt belongs to different details. Start a new attempt.");
    if (order.paid) throw new CheckoutError(409, "This checkout attempt has already been paid.");
    let session;
    if (order.stripeSessionId) {
        session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
    } else {
        // Stripe may prune idempotency keys after 24h. Never recreate an old attempt.
        if (now - new Date(order.checkoutStartedAt).getTime() > 23 * 60 * 60 * 1000) throw new CheckoutError(409, "This checkout attempt has expired. Start a new attempt.");
        session = await stripe.checkout.sessions.create({
            line_items: order.line_items.map(item => ({ quantity: item.quantity, price_data: {
                currency: "gbp", product_data: { name: item.price_data.product_data.name }, unit_amount: item.price_data.unit_amount } })),
            mode: "payment", customer_email: order.email,
            success_url: order.checkoutOrigin + "/cart?session_id={CHECKOUT_SESSION_ID}",
            // The session placeholder is documented for success_url. Use the
            // already-persisted opaque attempt ID for the cancellation return.
            cancel_url: order.checkoutOrigin + "/cart?cancel=1&attempt_id=" + order.checkoutAttemptId,
            metadata: { orderId: String(order._id), checkoutAttemptId: order.checkoutAttemptId },
        }, { idempotencyKey: "checkout-" + order.checkoutAttemptId });
        if (!sessionMatchesOrder(session, order)) throw new CheckoutError(502, "Unable to verify the checkout session.");
        // If this write fails, retrying replays exactly the same persisted parameters
        // with the same Stripe key; a second session or order is not created.
        await Order.updateOne({ _id: order._id }, { $set: { stripeSessionId: session.id } });
    }
    if (!sessionMatchesOrder(session, order)) throw new CheckoutError(502, "Unable to verify the checkout session.");
    if (session.status !== "open" || !session.url) throw new CheckoutError(409, "This checkout session is no longer open. Start a new attempt.");
    return session.url;
}

export function sessionMatchesOrder(session, order) {
    return session?.livemode === false && /^cs_test_[A-Za-z0-9]+$/.test(session.id || "") && session.mode === "payment"
        && session.metadata?.orderId === String(order._id)
        && session.metadata?.checkoutAttemptId === order.checkoutAttemptId
        && (!order.stripeSessionId || session.id === order.stripeSessionId)
        && session.currency === "gbp" && session.amount_total === order.totalAmount;
}

export function paymentStatus(session, order) {
    if (!sessionMatchesOrder(session, order)) throw new CheckoutError(404, "Payment session not found.");
    if (order.paid && session.payment_status === "paid" && session.status === "complete") return "paid";
    if (session.payment_status === "paid") return "processing";
    if (order.paymentState === "failed" || session.status === "expired") return "unsuccessful";
    if (session.status === "open") return "unpaid";
    return "processing";
}

export function verifyStripeEvent(stripe, body, signature, secret) {
    if (!signature || body.length > 1048576) throw new CheckoutError(400, "Invalid webhook signature.");
    const event = stripe.webhooks.constructEvent(body, signature, secret);
    if (event.livemode !== false) throw new CheckoutError(400, "Only test events are accepted.");
    return event;
}

export async function processStripeEvent(event, { stripe, Order }) {
    if (event.livemode !== false) throw new CheckoutError(400, "Only test events are accepted.");
    const types = ["checkout.session.completed", "checkout.session.async_payment_succeeded", "checkout.session.async_payment_failed", "checkout.session.expired"];
    if (!types.includes(event.type)) return;
    const sessionId = event.data?.object?.id;
    if (!/^cs_test_[A-Za-z0-9]+$/.test(sessionId || "")) throw new CheckoutError(400, "Invalid test session.");
    // Retrieve current state: out-of-order event payloads cannot regress payment.
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!/^[a-f0-9]{24}$/i.test(session.metadata?.orderId || "")) return;
    const order = await Order.findById(session.metadata.orderId);
    if (!order || !order.checkoutAttemptId) return; // Not a checkout created by this integration.
    if (!sessionMatchesOrder(session, order)) throw new CheckoutError(400, "Payment session mismatch.");
    if (session.payment_status === "paid" && session.status === "complete") {
        await Order.updateOne({ _id: order._id, paid: false }, { $set: {
            paid: true, paymentState: "paid", stripeSessionId: session.id, paidAt: new Date() } });
    } else if (event.type === "checkout.session.async_payment_failed" || session.status === "expired") {
        await Order.updateOne({ _id: order._id, paid: false }, { $set: {
            paymentState: session.status === "expired" ? "expired" : "failed", stripeSessionId: session.id } });
    }
}
