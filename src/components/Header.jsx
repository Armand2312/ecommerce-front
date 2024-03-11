"use client"
import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import { CartIcon } from "../../public/Icons";

export default function Header() {
    const { cartProducts } = useContext(CartContext);
    //const [isHovered, setIsHovered] = useState(false);
    //console.log(cartProducts);

    return (
        <header className="md:flex hidden bg-gray-800 top-0 sticky p-4 pl-6 pr-6 justify-between w-full z-10">
            <Link className="text-white" href={"/"} scroll={false}>Ecommerce</Link>
            <nav className="flex justify-between w-1/2 text-gray-400">
                <Link className="hover:text-gray-200" href={"/"} scroll={false}>Home</Link>
                <Link className="hover:text-gray-200" href={"/products"} scroll={false}>Products</Link>
                <Link className="hover:text-gray-200" href={"/categories"} scroll={false}>Categories</Link>
                <Link className="hover:text-gray-200" href={"/account"} scroll={false}>Account</Link>
                <Link className="hover:text-gray-200 flex items-center text-center" scroll={false}/* onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} */ href={"/cart"}>
                    {/* <CartIcon sizes={17} color={isHovered ? "rgb(229 231 235)" : "rgb(156 163 175)"} /> */}
                    Cart
                    ({cartProducts.length})
                </Link>

            </nav>
        </header>
    )
}