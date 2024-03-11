"use client";
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    //const defaultProducts = ls ? JSON.parse(ls?.getItem("cart")) : [];

    const [cartProducts, setCartProducts] = useState([]);
    

    function deleteProduct(productId) {
        setCartProducts(prev => prev.filter((item) => item != productId));
        //console.log(productId)
    }

    function addProduct(productId) {
        setCartProducts(prev => [...prev, productId]);
    }

    function setQuantity(quantity, productId) {
        const quantityNum = Number(quantity)
        const initialQuantity = cartProducts.filter(id => id === productId).length;
        const productQuantity = Array(quantityNum).fill(productId);
        
        if (quantity !== initialQuantity) {
            setCartProducts(prev => [...prev.filter((item) => item != productId).concat(productQuantity)])
        }
    }


    useEffect(() => {

        if (cartProducts?.length > 0) {
            ls?.setItem("cart", JSON.stringify(cartProducts));
        }
    }, [cartProducts])

    useEffect(() => {
        if (ls && ls.getItem("cart")) {
            setCartProducts(JSON.parse(ls.getItem("cart")));
        }
    }, [])

    return (
        <CartContext.Provider value={{ cartProducts, setCartProducts, addProduct, deleteProduct, setQuantity }}>
            {children}
        </CartContext.Provider>
    )
}