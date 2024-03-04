import Featured from "@/components/Featured";
import Header from "@/components/Header";

export default function Home() {

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-800 ">
        <Featured />
      </div>
    </>
  );
}
