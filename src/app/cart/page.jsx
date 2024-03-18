import CartOrderInfo from "@/components/CartOrderInfo";
import CartProducts from "@/components/CartProducts";
import NavLayout from "@/components/NavLayout";


export default function Cart() {
    return (
        <NavLayout>
            <div className="bg-gray-200 pt-4 pb-4 md:p-5 flex flex-col  md:grid md:grid-cols-[1.3fr_0.7fr] gap-5">
                <div>
                    <CartProducts />
                </div>
                <div>
                    <CartOrderInfo />
                </div>
            </div>
        </NavLayout>
    )
}