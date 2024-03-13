"use client"
import getLatestProducts from "@/lib/getLatestProducts";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Spinner from "./Spinner";

export default function AllProducts() {
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        async function latestProducts() {
            const response = await getLatestProducts();
            setProducts(response.data.products)
            if (response?.data.products) {
                setLoading(false);
            }
        }
        latestProducts();
    }, []);

    return (
        <div className="h-full w-full relative">
            
            {/* Loading state */}
            {loading ? (
                <>
                    <h1 className="ml-[50px] font-semibold text-2xl">New Arrivals</h1>
                    <div className="flex min-h-[40vh] justify-center items-center">
                        <Spinner />
                    </div>
                </>
            ) : (
                /* Product cards */
                <>
                    <h1 className="ml-[50px] font-semibold text-2xl">New Arrivals</h1>
                    <div className="md:grid md:grid-cols-3 xl:grid-cols-4 flex flex-col space-y-4 md:space-y-0 md:space-x-8 md:ml-[50px] md:mr-[50px] mt-[25px] mb-[50px]">
                        {products.length > 0 && products.map((product, index) => (
                            <div key={index}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </>
            )}

        </div>
    )
}