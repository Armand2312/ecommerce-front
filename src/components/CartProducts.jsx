"use client"
import { CartIcon } from "../../public/Icons";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import axios from "axios";
import CartIndividualProducts from "./CartIndividualProducts";
import Spinner from "./Spinner";

export default function CartProducts() {
    const { cartProducts } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("");

    useEffect(() => {
        if (cartProducts.length === 0) {
            setProducts([]);
            setError("");
            setLoading(false);
            return;
        }
        const controller = new AbortController();
        async function loadCart() {
            setLoading(true);
            setError("");
            try {
                const response = await axios.post("/api/cart", { productIds: cartProducts }, {
                    signal: controller.signal,
                    timeout: 15000,
                });
                if (!Array.isArray(response.data.products)) throw new Error("Invalid cart response.");
                if (!controller.signal.aborted) setProducts(response.data.products);
            } catch {
                if (!controller.signal.aborted) setError("Unable to load your cart. Please refresh to try again.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        loadCart();
        return () => controller.abort();
    }, [cartProducts])

    return (
        <div className="bg-white rounded-md p-2 md:min-w-[300px] w-full space-y-2 flex flex-col">
            <div className="flex items-center">
                <CartIcon sizes={22} color={"black"} />
                <h1 className="ml-2 font-semibold text-xl">Cart</h1>
            </div>
            {loading ? (
                <div className="h-full flex items-center justify-center w-full">
                    <Spinner />
                </div>
            ) : error ? (
                <p role="alert">{error}</p>
            ) : (!cartProducts.length ? (
                <div>Your cart is empty</div>
            ) : (
                products.length > 0 && (
                    <>
                        {products.map((product, index) => (
                            <div key={index}>
                                <CartIndividualProducts product={product} quantity={cartProducts.filter(id => id === product._id).length} />

                            </div>
                        ))}
                    </>
                )))}
        </div>
    )
}
