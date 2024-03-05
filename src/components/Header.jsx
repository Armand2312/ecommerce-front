"use client"
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";

export default function Header() {
    const { cartProducts } = useContext(CartContext);
    console.log(cartProducts);
    return (
        <header className="flex bg-gray-800 top-0 sticky p-4 pl-6 pr-6 justify-between w-full z-10">
            <Link className="text-white" href={"/"}>Ecommerce</Link>
            <nav className="flex justify-between w-1/2 text-gray-400">
                <Link className="hover:text-gray-200" href={"/"}>Home</Link>
                <Link className="hover:text-gray-200" href={"/products"}>Products</Link>
                <Link className="hover:text-gray-200" href={"/categories"}>Categories</Link>
                <Link className="hover:text-gray-200" href={"/account"}>Account</Link>
                <Link className="hover:text-gray-200" href={"/cart"}>Cart ({cartProducts.length})</Link>

            </nav>
        </header>
    )
}