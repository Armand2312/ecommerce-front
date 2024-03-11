import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
    await mongooseConnect();
    const {fullname, email, phoneNumber, city, postCode, address, country, cartProducts} = await req.json();
    /* const productIds = cart_products.split(",");
    const uniqueIds = [... new Set(productIds)];
    const productInfo = await Product.find({_id: uniqueIds}) */

    console.log( {email})
    return NextResponse.json({message: "got the req"})
}