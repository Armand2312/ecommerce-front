export default function ProductCard({ product }) {
    return (
        <div className="flex flex-col items-center rounded-md shadow-lg p-2 hover:cursor-pointer hover:scale-125 hover:bg-white bg-gray-100 transition-all">
            <img className="h-[175px]" src={product.images[0]}></img>
            <div className="flex text-center">
                {product.title}
            </div>
        </div>
    )
}