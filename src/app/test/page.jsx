"use client"
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Test () {
    useEffect(() => {
        
        axios.get("/api/products").then(Response => {
            console.log(Response);
            //setProductInfo(Response.data.product);
        })
    }, []);
    return (
<div> test</div>
    )
}