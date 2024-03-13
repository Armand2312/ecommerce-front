import AllProducts from "@/components/AllProducts";
import Header from "@/components/Header";

export default function ProductsPage() {
    return (
        <>
            <Header />
            <div className="p-6 bg-gray-200">
                <AllProducts />
            </div>
        </>
    )
}