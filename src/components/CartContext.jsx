"use client";
import { createContext, useCallback, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
    const [cartProducts, setCartProducts] = useState([]);
    const [hydrated, setHydrated] = useState(false);

    const emptyCart = useCallback(() => {
        setCartProducts([]);
        try { window.localStorage.removeItem("cart"); } catch { /* Storage may be unavailable. */ }
    }, []);

    function deleteProduct(productId) {
        setCartProducts(prev => prev.filter(item => item !== productId));
    }
    function addProduct(productId) {
        setCartProducts(prev => {
            if (prev.filter(id => id === productId).length >= 20) return prev;
            return [...prev, productId];
        });
    }
    function setQuantity(quantity, productId) {
        const count = Number(quantity);
        if (!Number.isInteger(count) || count < 1 || count > 20) return;
        setCartProducts(prev => prev.filter(item => item !== productId).concat(Array(count).fill(productId)));
    }

    useEffect(() => {
        try {
            const stored = JSON.parse(window.localStorage.getItem("cart") || "[]");
            if (Array.isArray(stored) && stored.every(id => typeof id === "string")) setCartProducts(stored);
        } catch { /* Keep an empty cart when stored data cannot be read. */ }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        try {
            if (cartProducts.length) window.localStorage.setItem("cart", JSON.stringify(cartProducts));
            else window.localStorage.removeItem("cart");
        } catch { /* The in-memory cart remains usable without storage. */ }
    }, [cartProducts, hydrated]);

    return <CartContext.Provider value={{ cartProducts, setCartProducts, addProduct, deleteProduct, setQuantity, emptyCart }}>
        {children}
    </CartContext.Provider>;
}
