import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SK);

export async function POST(req) {
    await mongooseConnect();
    const { fullname, email, phoneNumber, city, postCode, address, country, cartProducts } = await req.json();
    const productIds = cartProducts.split(",");
    const uniqueIds = [... new Set(productIds)];
    const productInfo = await Product.find({ _id: uniqueIds })

    const line_items = []
    for (const productId of uniqueIds) {
        const info = productInfo.find(p => p._id.toString() === productId);
        const quantity = productIds.filter(id => id === productId)?.length || 0;

        if (quantity > 0) {
            line_items.push({
                quantity,
                price_data: {
                    currency: "GBP",
                    product_data: { name: info.title },
                    unit_amount: quantity * info.price * 100,
                },
            })       
        }
    }

    const orderDoc = await Order.create({ line_items, fullname, email, phoneNumber, city, postCode, address, country, paid: false });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        customer_email: email,
        success_url: process.env.PUBLIC_URL + "/cart?success=1",
        cancel_url: process.env.PUBLIC_URL + "/cart?cancel=1",
        metadata: { orderId: orderDoc._id.toString() }
    })
    
    //console.log(session);

    return NextResponse.json({url: session.url })
}