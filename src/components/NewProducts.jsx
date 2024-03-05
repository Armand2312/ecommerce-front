"use client"
import getLatestProducts from "@/lib/getLatestProducts";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function NewProducts() {
    const [products, setProducts] = useState({});
    const [imageSrc, setImageSrc] = useState([]);

    useEffect(() => {
        async function latestProducts() {
            const response = await getLatestProducts();
            setProducts(response.data.products)
            //console.log(response);
        }
        latestProducts();
    }, []);

    console.log(products)
    return (
        <div className="h-full  w-full relative">
            <h1 className="ml-[50px] font-semibold text-2xl">New Arrivals</h1>
            <div className="md:grid md:grid-cols-3 lg:grid-cols-4 flex flex-col space-y-4 md:space-y-0 md:space-x-8 md:ml-[50px] md:mr-[50px] mt-[25px] mb-[50px]">
                {products.length > 0 && products.map((product, index) => (
                    <div key={index}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    )
}