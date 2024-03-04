import { NextResponse } from "next/server";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";

export async function GET(req) {
    const { method } = req;
    await mongooseConnect();
    const id = req.nextUrl.searchParams.get("id");
    try {
      //console.log(id);
      if (id) {
        const product = await Product.findOne({ _id: id });
        return NextResponse.json({ product });
  
      } else {
        const products = await Product.find({}, null, {sort: {"_id": -1}, limit: 10});
        return NextResponse.json({ products });
      }
  
    } catch (error) {
      console.error('Error:', error);
      if (error.name == "CastError") {
        return NextResponse.json({ message: "No product with the specified ID" })
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }