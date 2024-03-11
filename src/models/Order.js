import { model, Schema } from "mongoose"
import mongoose from "mongoose"


const OrderSchema = new Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    city: { type: String, required: true },
    postCode: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    paid: { type: Boolean, required: true }
}, {
    timestamps: true,
});

export const Order = mongoose.models.Order || model("Order", OrderSchema);