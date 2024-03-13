"use client"
import Header from "@/components/Header";
import SingleProduct from "@/components/SingleProduct";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation'
import axios from "axios";
import Spinner from "@/components/Spinner";

export default function ProductPage() {
    const params = useParams();
    const [productInfo, setProductInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const id = params.id;

    useEffect(() => {
        setLoading(true);
        axios.get("/api/products?id=" + id).then(response => {
            setProductInfo(response.data.product);
            setLoading(false);
        })
    }, [id])

    console.log(productInfo)
    return (
        <>
            <Header />
            <div className="p-6 bg-gray-200">
                {loading ? (
                    <div className="flex min-h-[70vh] justify-center items-center">
                        <Spinner />
                    </div>
                ) : (
                    <div className="p-5 h-full w-full justify-center items-center">
                        <SingleProduct productInfo={productInfo}/>
                    </div>
                )}
            </div>
        </>
    )
}