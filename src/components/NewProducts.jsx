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
        <div className="h-full w-full">
            <div className="grid grid-cols-4 space-x-10 items-center ml-[50px] mr-[50px] mt-[25px] mb-[25px]">
                {products.length > 0 && products.map((product, index) => (
                    <div key={index}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    )
}