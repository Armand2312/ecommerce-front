"use client";
import getLatestProducts from "@/lib/getLatestProducts";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Spinner from "./Spinner";

export default function AllProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        async function loadProducts() {
            setLoading(true);
            setError("");
            try {
                const products = await getLatestProducts(controller.signal);
                if (!controller.signal.aborted) setProducts(products);
            } catch {
                if (!controller.signal.aborted) setError("Unable to load products. Please try again.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        loadProducts();
        return () => controller.abort();
    }, [retry]);

    return (
        <div className="h-full w-full relative">
            <h1 className="ml-[50px] font-semibold text-2xl">All Products</h1>
            {loading ? (
                <div role="status" aria-label="Loading products" className="flex min-h-[40vh] justify-center items-center"><Spinner /></div>
            ) : error ? (
                <div role="alert" className="p-6 text-center">
                    <p>{error}</p>
                    <button type="button" onClick={() => setRetry(value => value + 1)} className="underline mt-2">Try again</button>
                </div>
            ) : products.length === 0 ? (
                <p className="p-6 text-center">No products are available yet.</p>
            ) : (
                <div className="md:grid md:grid-cols-3 xl:grid-cols-4 flex flex-col space-y-4 md:space-y-0 md:space-x-8 md:ml-[50px] md:mr-[50px] mt-[25px] mb-[50px]">
                    {products.map(product => <ProductCard key={product._id} product={product} />)}
                </div>
            )}
        </div>
    );
}
