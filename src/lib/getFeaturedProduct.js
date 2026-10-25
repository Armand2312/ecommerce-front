import axios from "axios";

export default async function getFeaturedProduct(productId, signal) {
    const response = await axios.get("/api/products", {
        params: { id: productId }, signal, timeout: 15000,
    });
    if (!response.data.product?._id) throw new Error("Invalid product response.");
    return response.data.product;
}
