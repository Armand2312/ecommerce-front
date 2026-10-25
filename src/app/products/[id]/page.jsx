"use client";
import SingleProduct from "@/components/SingleProduct";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import getFeaturedProduct from "@/lib/getFeaturedProduct";
import Spinner from "@/components/Spinner";
import NavLayout from "@/components/NavLayout";

function ProductDetails({ id }) {
    const [productInfo, setProductInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false);
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        async function loadProduct() {
            setLoading(true);
            setError("");
            setNotFound(false);
            try {
                const product = await getFeaturedProduct(id, controller.signal);
                if (!controller.signal.aborted) setProductInfo(product);
            } catch (error) {
                if (controller.signal.aborted) return;
                if ([400, 404].includes(error.response?.status)) setNotFound(true);
                else setError("Unable to load this product. Please try again.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        loadProduct();
        return () => controller.abort();
    }, [id, retry]);

    if (loading) return <div role="status" aria-label="Loading product" className="flex min-h-[70vh] justify-center items-center"><Spinner /></div>;
    if (notFound) return <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p>This product may have been removed or the link is incorrect.</p>
        <Link href="/products" className="underline mt-2 inline-block">Browse products</Link>
    </div>;
    if (error) return <div role="alert" className="p-6 text-center">
        <p>{error}</p>
        <button type="button" onClick={() => setRetry(value => value + 1)} className="underline mt-2">Try again</button>
    </div>;
    return <div className="md:p-5 h-full w-full justify-center items-center"><SingleProduct productInfo={productInfo} /></div>;
}

export default function ProductPage() {
    const { id } = useParams();
    return <NavLayout>
        <div className="md:p-6 bg-gray-200"><ProductDetails key={id} id={id} /></div>
    </NavLayout>;
}
