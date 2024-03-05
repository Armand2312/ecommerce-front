"use client"
import { useContext, useEffect, useState } from "react";
import getFeaturedProduct from "@/lib/getFeaturedProduct";
import { CartContext } from "./CartContext";

export default function Featured() {
    const [featuredProduct, setFeaturedProduct] = useState({});
    const [imageSrc, setImageSrc] = useState("");
    const { addProduct } = useContext(CartContext);

    /* Featured Product Data */
    const featuredProductId = "65e0e41de24fe35cc0b6dc08";
    useEffect(() => {
        async function fetchFeaturedProduct() {
            const response = await getFeaturedProduct(featuredProductId);
            setFeaturedProduct(response.data.product);
            setImageSrc(response.data.product.images[0]);
        }
        fetchFeaturedProduct();
    }, []);


    function addFeaturedToCart() {
        addProduct(featuredProduct._id);
    }

    //console.log(featuredProduct);
    return (
        /* Grid divide */
        <div className="grid grid-cols-1  md:grid-cols-[50%_50%]">
            {/* Text section */}
            <div className="text-white  md:mt-[100px] md:ml-[50px] lg:ml-[50px]">
                <div className="space-y-7">
                    <h1 className="font-semibold text-4xl lg:text-6xl">{featuredProduct.title}</h1>
                    <p className="text-gray-400 line-clamp-5">
                        {featuredProduct.description}
                    </p>
                </div>
                {/* Buttons */}
                <div className="flex flex-col space-y-3 items-center mt-2 mr-6">
                    <button className="text-blue-500 hover:underline">Learn more</button>
                    <button onClick={addFeaturedToCart} className="bg-blue-500 hover:bg-blue-400 text-white rounded-3xl p-2">Add to cart</button>
                </div>
            </div>
            {/* Image Section */}
            <div className="flex w-full justify-center order-first md:order-last items-center ">
                <img className="h-[400px]" src={imageSrc}></img>
            </div>
        </div>
    )
}