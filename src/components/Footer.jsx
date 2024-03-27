import Link from "next/link";
import { EmailIcon, GithubIcon, LikedInIcon } from "../../public/Icons";

export default function Footer() {
    return (
        <>
            <div className="bg-gray-800 flex md:flex-row flex-col gap-6 text-white p-4 justify-between bottom-0 text-center">

                {/* Logo */}
                <div className="flex justify-center items-center gap-1 md:ml-[100px]">
                    <a href="https://armand2312.github.io/">
                        <img className="cursor-pointer h-[50px] rounded-[75px] border-[3px] border-white" src="https://armand-next-ecommerce.s3.eu-west-2.amazonaws.com/armandlogo-ezgif.com-webp-to-jpg-converter+(1).jpg" alt="" />
                    </a>
                </div>

                {/* Mid Section */}
                <div className="flex flex-col gap-2 md:ml-[50px]">
                    <div className="flex flex-col gap-2">
                        <h1>My Profiles</h1>
                        {/* Media Icons */}
                        <div className="flex flex-row justify-center gap-3">
                            <div className="cursor-pointer">
                                <a href="https://www.linkedin.com/in/armand-oral-a6a749270/">
                                    <LikedInIcon sizes={30} color={"white"} />
                                </a>
                            </div>
                            <div className="cursor-pointer">
                                <a href="https://github.com/Armand2312">
                                    <GithubIcon sizes={30} color={"white"} />
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Portfolio */}
                    <div className="flex flex-col">
                        <h1>Portfolio Website</h1>
                        <Link href={"https://armand2312.github.io/"} className=" hover:underline cursor-pointer">
                            https://armand2312.github.io/
                        </Link>
                    </div>
                </div>

                {/* Contact */}
                <div className="md:mr-[75px] flex flex-col">
                    <div className="flex gap-1 justify-center">
                        <h1>Contact</h1>
                        <EmailIcon sizes={25} color={"white"} />
                    </div>
                    <p>armand.oral231@gmail.com</p>
                </div>
            </div>
        </>
    )
}