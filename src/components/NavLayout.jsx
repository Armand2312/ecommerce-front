"use client"
import Header from "./Header";
import MobileSideBar from "./MobileSidebar";
import { useState } from "react";

export default function NavLayout({children}) {
    const [show, setShow] = useState(false);
    
    return (
        <div className="min-h-screen">
        <Header show={show} setShow={setShow}/>
        <MobileSideBar show={show}/>
            {children}       
        </div>
    )
}