"use client"
import { useContext } from "react"
import { CartContext } from "./CartContext"

export default function ProductCard({ product }) {
    const { addProduct } = useContext(CartContext);
    return (
        <div className="group relative">
            <div className="flex flex-col items-center rounded-md shadow-lg p-2 hover:scale-110 hover:shadow-2xl hover:bg-white bg-gray-100 duration-500 transition-all">
                <img className="h-[175px]" src={product.images[0]}></img>
                <div className="flex text-center font-semibold">
                    {product.title}
                </div>
                <div className="font-thin">
                    £{product.price}
                </div>
                <div className="space-x-3 bottom-0 flex transition-all">
                    <button className="border border-gray-400 rounded-md p-1 hover:underline">Learn more</button>
                    <button onClick={() => addProduct(product._id)} className="bg-blue-500 rounded-md p-1 pl-2 pr-2 text-white hover:bg-blue-400">Buy</button>
                </div>
            </div>
        </div>
    )
}