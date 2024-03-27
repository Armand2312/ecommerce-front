import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SK);

export async function POST(req) {
    await mongooseConnect();
    const requestHeaders = new Headers(req.headers);
    const signature = requestHeaders.get('stripe-signature');

    let event;
    const body = await req.text();

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.WEBHOOK_SK);
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: err });
    }


    switch (event.type) {
        case 'checkout.session.completed':
            const data = event.data.object;
            const orderId = data.metadata.orderId;
            const paid = data.payment_status === "paid";
            console.log(orderId);

            if (orderId && paid) {
                const orderRes = await Order.findByIdAndUpdate(orderId, { paid: true });
                console.log(orderRes);
            }

            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }



    // Handle the event

    return NextResponse.json({ message: "stripe run" });
}



//helped-tough-defeat-silent
//acct_1Ot9pC06VKVqL0Gh