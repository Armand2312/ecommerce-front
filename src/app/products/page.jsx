import AllProducts from "@/components/AllProducts";
import NavLayout from "@/components/NavLayout";

export default function ProductsPage() {
    return (
        <NavLayout>   
            <div className="p-6 bg-gray-200">
                <AllProducts />
            </div>
        </NavLayout>
    )
}