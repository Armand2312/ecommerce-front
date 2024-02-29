export default function Featured() {
    return (
        <div className="grid grid-cols-2 ">
            <div className="text-white space-y-7">
                <h1 className="font-semibold text-4xl">Iphone 14 Pro</h1>
                <p className="text-gray-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>
            <div className="flex w-full justify-center items-center">
                <img className="h-[400px] rounded-md shadow-md border " src="https://armand-next-ecommerce.s3.eu-west-2.amazonaws.com/1709156673455.jpg"></img>
            </div>
        </div>
    )
}