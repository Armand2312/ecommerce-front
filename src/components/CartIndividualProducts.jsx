"use client"
import { useContext, useEffect, useState } from "react"
import { CartContext } from "./CartContext"

export default function CartIndividualProducts({ product, quantity }) {
    const { deleteProduct, setQuantity } = useContext(CartContext);
    const quantitySelectArray = [...Array(20)].map((item, index) => index + 1);
    //console.log(quantitySelectArray.map((item, index) => item))
    function deleteProductById(productId) {
        deleteProduct(productId);
    }

    function quantityChange(quantity, productId) {
        setQuantity(quantity, productId);
    }

    /* useEffect(() => {
        setQuantity(4, '65e0e41de24fe35cc0b6dc08');
    }) */

    return (
        <div className="shadow-md p-2 border flex rounded-md justify-between">
            <div className="flex">
                <img className="h-[100px]" src={product.images[0]}></img>
                <div>
                    <h1 className="font-semibold">{product.title}</h1>
                    
                    Quantity:
                    <select name="quantity-select" value={quantity} onChange={(ev) => quantityChange(ev.target.value, product._id)} className="w-auto border border-gray-500 rounded-md p-2">
                    
                        {quantitySelectArray.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <button onClick={() => deleteProductById(product._id)} className="bg-gray-300 border border-gray-400 p-1 hover:bg-gray-200 rounded-md">Remove</button>
            </div>
        </div>
    )
}