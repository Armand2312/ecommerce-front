"use client"
import { useContext } from "react"
import { CartContext } from "./CartContext";
import Link from "next/link";
import { CartIcon, HomeIcon, ProductsIcon } from "../../public/Icons";
import { usePathname } from "next/navigation";

export default function MobileSideBar({ show }) {
    const { cartProducts } = useContext(CartContext);
    const pathname = usePathname();

    return (
        <aside className={`${show ? "left-0" : "left-full"} md:hidden fixed w-full text-white transition-all p-6 bg-gray-800 h-full z-10`}>
            <div className="flex flex-col space-y-4">
                
                <Link className={`text-lg flex items-center gap-1 p-2 rounded-3xl pl-5 ${pathname === "/" ? "text-white bg-blue-500" : "text-gray-400"}`} href={"/"} scroll={false}>
                    <HomeIcon sizes={20} color={`${pathname === "/" ? "white" : "#9ca3af"}`} />
                    <h2>Home</h2>
                </Link>
                
                <Link className={`text-lg flex items-center gap-1 p-2 rounded-3xl pl-5 ${pathname.includes("products") ? "text-white bg-blue-500" : "text-gray-400"}`} href={"/products"} scroll={false}>
                    <ProductsIcon sizes={20} color={`${pathname.includes("products") ? "white" : "#9ca3af"}`} />
                    <h2>Products</h2>
                </Link>
                
                <Link className={`text-lg flex items-center gap-1 p-2 rounded-3xl pl-5 ${pathname.includes("cart") ? "text-white bg-blue-500" : "text-gray-400"}`} href={"/cart"} scroll={false}>
                    <CartIcon sizes={20} color={`${pathname.includes("cart") ? "white" : "#9ca3af"}`} />
                    <h2>Cart</h2>
                    ({cartProducts.length})
                </Link>
                

            </div>
        </aside>
    )
}