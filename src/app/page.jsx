import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";

export default function Home() {

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-800 ">
        <Featured />
      </div>
      <div className="p-6 bg-gray-200">
        <NewProducts />
      </div>
    </>
  );
}
