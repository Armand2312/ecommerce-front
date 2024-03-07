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

    useEffect(() => {
        setLoading(true);
        if (cartProducts?.length > 0) {
            axios.post("/api/cart", { productIds: cartProducts }).then(response => {
                setProducts(response.data.products);
               
                //console.log(response.data.products)
            }) 
        }
        setLoading(false);
    }, [cartProducts])
    console.log(cartProducts)

    return (
        <div className="bg-white rounded-md p-2 space-y-2 flex flex-col">
            <div className="flex items-center">
                <CartIcon sizes={22} color={"black"} />
                <h1 className="ml-2 font-semibold text-xl">Cart</h1>
            </div>
            {loading ? (
                <div className="h-24 flex items-center justify-center w-full">
                    <Spinner />
                </div>
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
                )

            )
            )}
        </div>
    )
}