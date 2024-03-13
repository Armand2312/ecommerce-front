"use client"
import { useState } from "react"

export default function SingleProduct({ productInfo }) {
    const [readMore, setReadMore] = useState(false);
    console.log(readMore);
    return (
        <div className="bg-white border shadow-md rounded-md p-4">
            <div className="flex flex-col md:flex-row">
                <img className="md:h-[300px] lg:h-[400px] md:mt-[40px]" src={productInfo?.images[0]}></img>
                <div className="flex flex-col text-center w-full md:mt-8">
                    <h1 className="font-semibold text-3xl">{productInfo.title}</h1>
                    <p className={`mt-4 whitespace-pre-wrap text-left ${readMore ? "line-clamp-none" : "line-clamp-[10]"}`}>{productInfo.description}</p>
                    <button className="text-blue-500 font-semibold hover:underline" onClick={() => setReadMore(prev => !prev)}>{readMore ? "Read less" : "Read more..."}</button>
                    <div>
                        <button className="bg-blue-500 hover:bg-blue-400 text-white rounded-3xl p-2 items-center gap-1 text-center mt-2">Add to cart</button>
                    </div>
                        
                    
                </div>
            </div>
        </div>
    )
}