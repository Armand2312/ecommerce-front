import { InfoIcon } from "../../public/Icons";

export default function CartOrderInfo() {
    return (
        <div className="bg-white rounded-md p-2">
            <div className="flex items-center">
                <InfoIcon sizes={22} color={"black"} />
                <h1 className="ml-2 font-semibold text-xl">Order Information</h1>
            </div>
            <button className="bg-black hover:bg-gray-800 p-1 text-white w-full rounded-md">Continue to payment</button>
        </div>
    )
}