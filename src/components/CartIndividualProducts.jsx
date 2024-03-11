"use client"
import { useContext, useState } from "react"
import { CartContext } from "./CartContext"

export default function CartIndividualProducts({ product, quantity }) {
    const { deleteProduct, setQuantity } = useContext(CartContext);
    const quantitySelectArray = [...Array(20)].map((item, index) => index + 1);

    /* Using context to delete product */
    function deleteProductById(productId) {
        deleteProduct(productId);
    }

    /* Using context to change quantity of product */
    function quantityChange(quantity, productId) {
        setQuantity(quantity, productId);
    }
    //console.log(quantity)
    return (
        <div className="shadow-md p-2 border flex rounded-md justify-between">
            <div className="flex">

                {/* Product Image */}
                <img className="h-[100px] hover:cursor-pointer" src={product.images[0]}></img>
                <div>
                    {/* Product Title */}
                    <h1 className="font-semibold">{product.title}</h1>

                    {/* Quantity Select Box */}
                    Quantity: {" "}
                    <select name="quantity-select" value={quantity} onChange={(ev) => quantityChange(ev.target.value, product._id)} className="w-auto border hover:cursor-pointer border-gray-500 rounded-md ">
                        {quantitySelectArray.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </select>
                    <div className="font-thin">
                        £{product.price}
                    </div>
                </div>

            </div>

            {/* Remove Button */}
            <div>
                <button onClick={() => deleteProductById(product._id)} className="bg-gray-300 border border-gray-400 p-1 hover:bg-gray-200 rounded-md">Remove</button>
            </div>
        </div>
    )
}