import CartOrderInfo from "@/components/CartOrderInfo";
import CartProducts from "@/components/CartProducts";
import Header from "@/components/Header";

export default function Cart() {
    return (
        <>
            <Header />
            <div className="bg-gray-200 pt-4 pb-4 md:p-10 flex flex-col  md:grid md:grid-cols-[1.3fr_0.7fr] gap-5">
               <CartProducts />
               <CartOrderInfo />
            </div>
        </>
    )
}