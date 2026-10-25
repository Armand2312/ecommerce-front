import axios from "axios";

export default async function getAllProducts(signal) {
    const response = await axios.get("/api/products", {
        params: { all: true }, signal, timeout: 15000,
    });
    if (!Array.isArray(response.data.products)) throw new Error("Invalid product response.");
    return response.data.products;
}
