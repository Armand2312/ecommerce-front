"use client"
import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import { BackIcon, CartIcon, HamburgerIcon } from "../../public/Icons";

export default function Header({ setShow, show }) {
    const { cartProducts } = useContext(CartContext);

    return (
        <header className="flex bg-gray-800 top-0 sticky p-4 pl-6 pr-6 justify-between w-full z-10">
            <Link className="text-white" href={"/"} scroll={false}>Ecommerce Demo</Link>

            {/* Mobile hamburger button */}
            <button onClick={() => setShow(prev => !prev)} className="md:hidden">
                {show ? (
                    <BackIcon sizes={20} color={"white"} />
                ) : (
                    <HamburgerIcon sizes={20} color={"white"} />
                )}
            </button>

            {/* Nav bar */}
            <nav className="hidden md:flex justify-between w-1/2 text-gray-400">
                <Link className="hover:text-gray-200" href={"/"} scroll={false}>Home</Link>
                <Link className="hover:text-gray-200" href={"/products"} scroll={false}>Products</Link>
                {/* <Link className="hover:text-gray-200" href={"/categories"} scroll={false}>Categories</Link> */}
                {/* <Link className="hover:text-gray-200" href={"/account"} scroll={false}>Account</Link> */}
                <Link className="hover:text-gray-200 flex items-center text-center" scroll={false} href={"/cart"}>
                    Cart
                    ({cartProducts.length})
                </Link>
            </nav>
        </header>
    )
}