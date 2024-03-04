"use client"
import { useEffect } from "react";
import getFeaturedProduct from "@/lib/getFeaturedProduct";

export default function Featured() {
    const featuredProductId = "65e0e39be24fe35cc0b6dbff";

    useEffect(() => {
        async function fetchFeaturedProduct() {
            const response = await getFeaturedProduct(featuredProductId);
            console.log(response);
        }
        fetchFeaturedProduct();
    }, []);

    return (
        /* Grid divide */
        <div className="grid grid-cols-1  md:grid-cols-[50%_50%]">
            {/* Text section */}
            <div className="text-white mt-[50px] md:mt-[100px] md:ml-[50px] lg:ml-[150px]">
                <div className="space-y-7">
                    <h1 className="font-semibold text-4xl">Iphone 14 Pro</h1>
                    <p className="text-gray-400">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>
                {/* Buttons */}
                <div className="flex flex-col space-y-3 items-center mt-2 mr-6">
                    <button className="text-blue-500 hover:underline">Learn more</button>
                    <button className="bg-blue-500 hover:bg-blue-400 text-white rounded-3xl p-2">Add to cart</button>
                </div>
            </div>
            {/* Image Section */}
            <div className="flex w-full justify-center order-first md:order-last items-center ">
                <img className="h-[400px]" src="https://armand-next-ecommerce.s3.eu-west-2.amazonaws.com/1709241216604.png"></img>
            </div>
        </div>
    )
}