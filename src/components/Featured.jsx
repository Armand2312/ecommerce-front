"use client"
import { useContext, useEffect, useState } from "react";
import getFeaturedProduct from "@/lib/getFeaturedProduct";
import { CartContext } from "./CartContext";
import { CartIcon } from "../../public/Icons";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Featured() {
    const [featuredProduct, setFeaturedProduct] = useState(null);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(0);
    const [loading, setLoading] = useState(true);
    const { addProduct } = useContext(CartContext);

    /* Featured Product Data */
    const featuredProductId = "65e0e41de24fe35cc0b6dc08";
    useEffect(() => {
        const controller = new AbortController();
        async function loadFeaturedProduct() {
            setLoading(true);
            setError("");
            setFeaturedProduct(null);
            try {
                const product = await getFeaturedProduct(featuredProductId, controller.signal);
                if (!controller.signal.aborted) setFeaturedProduct(product);
            } catch (error) {
                if (!controller.signal.aborted && error.response?.status !== 404) {
                    setError("Unable to load the featured product. Please try again.");
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        loadFeaturedProduct();
        return () => controller.abort();
    }, [retry]);
    function addFeaturedToCart() {
        addProduct(featuredProduct._id);
        toast.success("Product added to cart.",
            {
                position: "top-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
    }


    if (!loading && error) {
        return <div role="alert" className="text-white text-center py-12">
            <p>{error}</p>
            <button type="button" onClick={() => setRetry(value => value + 1)} className="underline mt-2">Try again</button>
        </div>;
    }
    if (!loading && !featuredProduct) {
        return <div className="text-white text-center py-12">
            <h1 className="font-semibold text-3xl">Welcome to our demo store</h1>
            <p className="mt-2">No featured product is available right now.</p>
            <Link href="/products" className="underline mt-2 inline-block">Browse products</Link>
        </div>;
    }

    return (
        <>
            {/* Loading state */}
            {loading ? (
                <div role="status" aria-label="Loading featured product" className="min-h-[100vh] md:min-h-[90vh] flex items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                /* Grid divide */
                <div className="grid grid-cols-1  md:grid-cols-[50%_50%]">

                    {/* Text section */}
                    <div className="text-white  md:mt-[100px] md:ml-[50px] lg:ml-[50px]">
                        <div className="space-y-7">
                            <h1 className="font-semibold text-4xl lg:text-6xl">{featuredProduct.title}</h1>
                            <p className="text-gray-400 line-clamp-5 text-justify">
                                {featuredProduct.description}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col space-y-3 items-center mt-2 mr-6">
                            <Link href={"/products/" + featuredProductId} className="text-blue-500 hover:underline" scroll={false}>Learn more</Link>
                            <button onClick={addFeaturedToCart} className="bg-blue-500 hover:bg-blue-400 text-white rounded-3xl p-2 flex items-center gap-1 text-center">Add to cart
                                <CartIcon sizes={15} color={"white"} />
                            </button>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="flex w-full justify-center order-first md:order-last items-center ">
                        <img className="h-[400px]" src={featuredProduct.images?.[0]} alt={featuredProduct.title}></img>
                    </div>
                </div>
            )}


        </>
    )
}
