import { model, Schema } from "mongoose"
import mongoose from "mongoose"


const LineItemSchema = new Schema({
    quantity: { type: Number, required: true },
    price_data: {
        currency: { type: String, default: "GBP" },
        product_data: { name: { type: String } },
        unit_amount: { type: Number },
    },
});

const OrderSchema = new Schema({
    line_items: [LineItemSchema],
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    city: { type: String, required: true },
    postCode: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    paid: { type: Boolean, required: true },
    checkoutAttemptId: String,
    requestHash: String,
    checkoutOrigin: String,
    checkoutStartedAt: Date,
    stripeSessionId: String,
    totalAmount: Number,
    currency: String,
    paymentState: String,
    paidAt: Date,
}, {
    timestamps: true,
});

export const Order = mongoose.models.Order || model("Order", OrderSchema);

let checkoutIndex;
export function ensureCheckoutIndex() {
    // Explicitly await the unique index, including when autoIndex is disabled.
    checkoutIndex ||= Order.collection.createIndex({ checkoutAttemptId: 1 }, {
        name: "checkout_attempt_unique", unique: true,
        partialFilterExpression: { checkoutAttemptId: { $type: "string" } },
    }).catch(error => { checkoutIndex = undefined; throw error; });
    return checkoutIndex;
}
