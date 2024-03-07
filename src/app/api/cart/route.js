import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
    await mongooseConnect();
    
    const {productIds} = await req.json();
    
    const products = await Product.find({_id: productIds})
    //const { productIds } = body;
    //console.log({productIds})
    //const {productIds} = body;
    return NextResponse.json({products})
}