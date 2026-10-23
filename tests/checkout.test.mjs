import test from "node:test";
import assert from "node:assert/strict";
import Stripe from "stripe";
import { validateCheckout, toPence, priceCart, checkoutOrigin, createCheckout,
    sessionMatchesOrder, paymentStatus, processStripeEvent, verifyStripeEvent } from "../src/lib/checkout.mjs";
import { getTestStripe } from "../src/lib/stripe.js";

const id = "65e0e41de24fe35cc0b6dc08";
const orderId = "65e0e41de24fe35cc0b6dc09";
const attemptId = "12345678-1234-4123-8123-123456789012";
const body = { fullname: "Demo Shopper", email: "demo@example.com", phoneNumber: "+44 0123456789",
    city: "London", postCode: "SW1A 1AA", address: "Demo Street", country: "UK", cartProducts: `${id},${id}`, attemptId };

function fixtures() {
    const records = [];
    const sessions = new Map();
    let creates = 0;
    let failSave = false;
    const Order = {
        findOne: async query => records.find(r => r.checkoutAttemptId === query.checkoutAttemptId),
        findById: async value => records.find(r => r._id === value),
        create: async data => {
            if (records.some(r => r.checkoutAttemptId === data.checkoutAttemptId)) throw Object.assign(new Error(), { code: 11000 });
            const record = { ...data, _id: orderId }; records.push(record); return record;
        },
        updateOne: async (query, update) => {
            if (failSave) { failSave = false; throw new Error("Simulated lost DB write"); }
            const record = records.find(r => r._id === query._id && (query.paid === undefined || r.paid === query.paid));
            if (record) Object.assign(record, update.$set);
        },
    };
    const Product = { find: async () => [{ _id: id, title: "Demo", price: 10.29 }] };
    const stripe = { checkout: { sessions: {
        create: async (params, options) => {
            if (sessions.has(options.idempotencyKey)) {
                assert.deepEqual(params, sessions.get(options.idempotencyKey).params);
                return sessions.get(options.idempotencyKey).session;
            }
            creates++;
            const session = { id: "cs_test_demo", livemode: false, mode: "payment", metadata: params.metadata,
                currency: "gbp", amount_total: 2058, status: "open", payment_status: "unpaid", url: "https://checkout.stripe.com/test" };
            sessions.set(options.idempotencyKey, { params: structuredClone(params), session }); return session;
        },
        retrieve: async () => [...sessions.values()][0].session,
    } } };
    const run = (overrides = {}) => createCheckout({ input: validateCheckout(body), origin: "http://localhost:3000", Order, Product, stripe, ...overrides });
    return { records, sessions, Order, Product, stripe, run, get creates() { return creates; }, failNextSave() { failSave = true; } };
}

test("GBP conversion uses exact pennies and rejects fractional or invalid prices", () => {
    assert.equal(toPence(10.29), 1029);
    assert.equal(toPence(0.29), 29);
    assert.equal(toPence(1.1), 110);
    for (const price of [1.005, -2, 0, NaN, Infinity, "10", 1e20]) assert.throws(() => toPence(price));
    const result = priceCart([[id, 2]], [{ _id: id, title: "Demo", price: 10.29 }]);
    assert.equal(result.line_items[0].price_data.unit_amount, 1029);
    assert.equal(result.line_items[0].quantity, 2);
    assert.equal(result.total, 2058);
});

test("validation aggregates duplicates, preserves phone formatting and ignores client prices", () => {
    const input = validateCheckout({ ...body, price: 0.01 });
    assert.deepEqual(input.items, [[id, 2]]);
    assert.equal(input.customer.phoneNumber, body.phoneNumber);
    assert.equal(input.requestHash, validateCheckout(body).requestHash);
    assert.throws(() => priceCart(input.items, []), /no longer available/);
});

test("malformed carts, invalid quantities and missing customer fields are rejected", () => {
    for (const change of [{ cartProducts: "" }, { cartProducts: "bad" }, { cartProducts: [id] },
        { cartProducts: Array(21).fill(id).join(",") }, { attemptId: "$bad" }, { fullname: " " },
        { email: "bad" }, { phoneNumber: 12345 }, { phoneNumber: "-----" }, { phoneNumber: "1234567890123456" },
        { address: {} }]) assert.throws(() => validateCheckout({ ...body, ...change }));
    for (const value of [null, [], "bad"]) assert.throws(() => validateCheckout(value));
});

test("only configured storefront origins are used for redirects", () => {
    assert.equal(checkoutOrigin("https://demo.example/"), "https://demo.example");
    for (const value of [undefined, "javascript:alert(1)", "https://user:pass@example.com", "http://example.com", "https://example.com/cart"]) assert.throws(() => checkoutOrigin(value));
});

test("retries, including concurrent attempts, reuse one order and session", async () => {
    const f = fixtures();
    await Promise.all([f.run(), f.run(), f.run()]);
    await f.run();
    assert.equal(f.records.length, 1); assert.equal(f.creates, 1);
    const params = [...f.sessions.values()][0].params;
    assert.equal(params.line_items[0].price_data.unit_amount, 1029);
    assert.match(params.success_url, /\{CHECKOUT_SESSION_ID\}/);
    assert.equal(params.cancel_url, "http://localhost:3000/cart?cancel=1&attempt_id=" + attemptId);
});

test("session created but MongoDB save failed: retry replays persisted prices and parameters", async () => {
    const f = fixtures(); f.failNextSave();
    await assert.rejects(f.run(), /lost DB write/);
    assert.equal(f.records[0].stripeSessionId, undefined);
    f.Product.find = async () => [{ _id: id, title: "Changed", price: 99 }];
    await f.run({ origin: "https://different.example" });
    assert.equal(f.records.length, 1); assert.equal(f.creates, 1);
    assert.equal(f.records[0].stripeSessionId, "cs_test_demo");
});

test("network failure after Stripe creates the session is safely retried", async () => {
    const f = fixtures(); const create = f.stripe.checkout.sessions.create;
    f.stripe.checkout.sessions.create = async (...args) => { await create(...args); throw new Error("Network lost"); };
    await assert.rejects(f.run(), /Network lost/);
    f.stripe.checkout.sessions.create = create;
    await f.run();
    assert.equal(f.creates, 1); assert.equal(f.records.length, 1);
});

test("changed payload and attempts older than Stripe retention are not recreated", async () => {
    const f = fixtures(); f.failNextSave(); await assert.rejects(f.run());
    await assert.rejects(f.run({ input: validateCheckout({ ...body, email: "other@example.com" }) }), /different details/);
    await assert.rejects(f.run({ now: Date.now() + 24 * 3600000 }), /expired/);
    assert.equal(f.creates, 1);
});

test("verification rejects live sessions, wrong totals, currencies, order links and session IDs", async () => {
    const f = fixtures(); await f.run();
    const session = await f.stripe.checkout.sessions.retrieve(); const order = f.records[0];
    assert.ok(sessionMatchesOrder(session, order));
    for (const change of [{ livemode: true }, { amount_total: 1 }, { currency: "usd" }, { id: "cs_test_other" },
        { mode: "subscription" }, { metadata: { orderId: "other" } }]) {
        assert.equal(sessionMatchesOrder({ ...session, ...change }, order), false);
        assert.throws(() => paymentStatus({ ...session, ...change }, order));
    }
    assert.equal(paymentStatus(session, order), "unpaid");
    session.payment_status = "paid"; session.status = "complete";
    assert.equal(paymentStatus(session, order), "processing");
    assert.equal(order.paid, false); // Status reads never mark orders paid.
    order.paid = true;
    assert.equal(paymentStatus(session, order), "paid");
});

test("webhooks are repeat-safe, reconcile a missing saved session, and never regress paid orders", async () => {
    const f = fixtures(); f.failNextSave(); await assert.rejects(f.run());
    const session = await f.stripe.checkout.sessions.retrieve();
    session.payment_status = "paid"; session.status = "complete";
    const event = { livemode: false, type: "checkout.session.completed", data: { object: { id: session.id } } };
    await processStripeEvent(event, f); const paidAt = f.records[0].paidAt;
    await processStripeEvent(event, f);
    assert.equal(f.records[0].paid, true); assert.equal(f.records[0].paidAt, paidAt);
    session.payment_status = "unpaid"; session.status = "expired";
    await processStripeEvent({ ...event, type: "checkout.session.expired" }, f);
    await processStripeEvent({ ...event, type: "checkout.session.async_payment_failed" }, f);
    assert.equal(f.records[0].paid, true); assert.equal(f.records[0].paymentState, "paid");
    await assert.rejects(processStripeEvent({ ...event, livemode: true }, f));
});

test("delayed payments remain pending, then failure or success is recorded from verified sessions", async () => {
    const f = fixtures(); await f.run(); const session = await f.stripe.checkout.sessions.retrieve();
    session.status = "complete";
    const event = { livemode: false, type: "checkout.session.completed", data: { object: { id: session.id } } };
    await processStripeEvent(event, f); assert.equal(f.records[0].paid, false);
    await processStripeEvent({ ...event, type: "checkout.session.async_payment_failed" }, f);
    assert.equal(paymentStatus(session, f.records[0]), "unsuccessful");
    session.payment_status = "paid";
    await processStripeEvent({ ...event, type: "checkout.session.async_payment_succeeded" }, f);
    assert.equal(paymentStatus(session, f.records[0]), "paid");
});

test("webhook verification requires an authentic signature over the unchanged raw body", () => {
    const stripe = new Stripe("sk_test_synthetic"); const secret = "whsec_synthetic";
    const raw = JSON.stringify({ livemode: false, type: "checkout.session.completed" });
    const signature = stripe.webhooks.generateTestHeaderString({ payload: raw, secret });
    assert.equal(verifyStripeEvent(stripe, raw, signature, secret).livemode, false);
    assert.throws(() => verifyStripeEvent(stripe, raw + " ", signature, secret));
    assert.throws(() => verifyStripeEvent(stripe, raw, null, secret));
    const live = JSON.stringify({ livemode: true });
    assert.throws(() => verifyStripeEvent(stripe, live, stripe.webhooks.generateTestHeaderString({ payload: live, secret }), secret));
});

test("Stripe configuration still rejects live and malformed keys", () => {
    const saved = process.env.STRIPE_SK;
    try {
        for (const key of ["", "sk_live_synthetic", "rk_test_synthetic", "invalid"]) {
            process.env.STRIPE_SK = key; assert.throws(() => getTestStripe(), /Live payments are disabled/);
        }
        process.env.STRIPE_SK = "sk_test_synthetic"; assert.ok(getTestStripe().checkout.sessions);
    } finally { if (saved === undefined) delete process.env.STRIPE_SK; else process.env.STRIPE_SK = saved; }
});
