import axios from "axios";

export default async function getLatestProducts(signal) {
    const response = await axios.get("/api/products", { signal, timeout: 15000 });
    if (!Array.isArray(response.data.products)) throw new Error("Invalid product response.");
    return response.data.products;
}
