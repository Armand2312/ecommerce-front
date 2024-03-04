import { model, Schema } from "mongoose"
import mongoose from "mongoose"


const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    properties: {type: Object},
}, {
    timestamps: true,
});

export const Product = mongoose.models.Product || model("Product", ProductSchema);