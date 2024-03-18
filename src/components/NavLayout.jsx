"use client"
import Header from "./Header";
import MobileSideBar from "./MobileSidebar";
import { useState } from "react";

export default function NavLayout({children}) {
    const [show, setShow] = useState(false);
    
    return (
        <>
        <Header show={show} setShow={setShow}/>
        <MobileSideBar show={show}/>
            {children}       
        </>
    )
}