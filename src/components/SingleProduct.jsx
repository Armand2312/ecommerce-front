"use client"
import { useContext, useState } from "react"
import { CartContext } from "./CartContext";
import { toast } from "react-toastify";

export default function SingleProduct({ productInfo }) {
    const { addProduct } = useContext(CartContext)
    const [readMore, setReadMore] = useState(false);
    const [activeImage, setActiveImage] = useState(productInfo?.images[0]);

    function addToCart(product) {
        addProduct(product);
        toast.success("Product added to cart.",
            {
                position: "top-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
    }

    return (
        <div className="bg-white border shadow-md rounded-md p-4">
            <div className="flex flex-col md:flex-row md:space-x-4">
                <h1 className="md:hidden text-center font-semibold text-3xl">{productInfo.title}</h1>

                {/* Big Image */}
                <div className="flex flex-col mt-3 md:mt-0 items-center">
                    <img className="h-[350px] w-[300px] md:h-[300px] md:w-[400px] md:mt-[40px]" src={activeImage}></img>
                    <div className="grid grid-cols-3 mt-5 mb-5 gap-2">
                        {productInfo.images.map((item, index) => (
                            <button onClick={() => setActiveImage(item)} key={index} className={`border-[2px] flex items-center justify-center rounded-md p-1 ${item === activeImage ? 'border-blue-500' : "border-gray-400"}`}>
                                <img className="md:h-[50px] h-[100px]" src={item} ></img>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Title and description */}
                <div className="flex flex-col text-center w-full md:mt-8">
                    <h1 className="hidden md:flex text-center font-semibold text-3xl">{productInfo.title}</h1>
                    <p className="flex font-light text-xl">Price: £{productInfo.price}</p>
                    <p className={`mt-4 whitespace-pre-wrap text-justify ${readMore ? "line-clamp-none" : "line-clamp-[15]"}`}>{productInfo.description}</p>
                    <button className="text-blue-500 font-semibold hover:underline" onClick={() => setReadMore(prev => !prev)}>{readMore ? "Read less" : "Read more..."}</button>
                    <div>
                        <button onClick={() => addToCart(productInfo._id)} className="bg-blue-500 hover:bg-blue-400 text-white rounded-3xl p-2 items-center gap-1 text-center mt-2">Add to cart</button>
                    </div>


                </div>
            </div>
        </div>
    )
}