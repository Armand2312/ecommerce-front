"use client"
import { useContext, useState } from "react";
import { InfoIcon } from "../../public/Icons";
import { CartContext } from "./CartContext";
import axios from "axios";
import * as Yup from "yup";

export default function CartOrderInfo() {
    const { cartProducts } = useContext(CartContext);
    const [fullname, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [city, setCity] = useState("");
    const [postCode, setPostCode] = useState("");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");

    const validationSchema = Yup.object().shape({
        fullname: Yup.string().required("Enter your full name."),
        email: Yup.string().email().required("Email is required"),
        phoneNumber: Yup.number().required("Enter your phone number"),
        city: Yup.string().required("Enter your city."),
        postCode: Yup.string().required("Enter your postcode."),
        address: Yup.string().required("Enter your full address."),
        country: Yup.string().required("Enter your full country."),

    });

    const submitForm = async (ev) => {
        ev.preventDefault();
        const data = {
            fullname: fullname,
            email: email,
            phoneNumber: phoneNumber,
            city: city,
            postCode: postCode,
            address: address,
            country: country,
            cartProducts: cartProducts.join(",")
        }
        axios.post("/api/checkout", data).then(response => {
            console.log(response);
        })
    }

    return (
        <>
            {!cartProducts.length ? (
                <></>
            ) : (
                <div className="bg-white rounded-md w-auto p-2 md:max-h-[76vh] max-h-[86vh]">
                    <div className="flex items-center mb-2">
                        <InfoIcon sizes={22} color={"black"} />
                        <h1 className="ml-2 font-semibold text-xl">Order Information</h1>
                    </div>


                    <form onSubmit={submitForm}>
                        <div className="flex flex-col w-full space-y-2 p-2">

                            {/* Name */}
                            <label className="flex flex-col">Name
                                <input name="fullname" value={fullname} onChange={ev => setFullName(ev.target.value)} className="border border-gray-400 rounded-md p-1" placeholder="Name" autoComplete="name"></input>
                            </label>

                            {/* Email */}
                            <label className="flex flex-col">Email
                                <input name="email" value={email} onChange={ev => setEmail(ev.target.value)} className="border border-gray-400 rounded-md p-1" placeholder="Email" autoComplete="email"></input>
                            </label>

                            {/* Phone Number */}
                            <label className="flex flex-col">Phone Number
                                <input name="phoneNumber" value={phoneNumber} onChange={ev => setPhoneNumber(ev.target.value)} className="border border-gray-400 rounded-md p-1" placeholder="Phone Number" autoComplete="tel"></input>
                            </label>

                            {/* City & Post Code */}
                            <div className="flex md:flex-row md:gap-1 flex-col space-y-2 md:space-y-0">
                                <label className="flex flex-col md:w-full">City
                                    <input name="city" value={city} onChange={ev => setCity(ev.target.value)} className="border border-gray-400 rounded-md p-1" placeholder="City" autoComplete="address-level2"></input>
                                </label>

                                <label className="flex flex-col md:w-full">Post Code
                                    <input name="postCode" value={postCode} onChange={ev => setPostCode(ev.target.value)} className="border border-gray-400 rounded-md p-1" placeholder="Post Code" autoComplete="postal-code"></input>
                                </label>
                            </div>

                            {/* Address */}
                            <label className="flex flex-col">Address
                                <input name="address" value={address} onChange={ev => setAddress(ev.target.value)} className="border border-gray-400 rounded-md p-1" placeholder="Address" autoComplete="address"></input>
                            </label>

                            {/* Country */}
                            <label className="flex flex-col">Country
                                <input name="country" value={country} onChange={ev => setCountry(ev.target.value)} className="border border-gray-400 rounded-md p-1" placeholder="Country" autoComplete="address-level1"></input>
                            </label>

                            <input name="cartProducts" type="hidden" value={cartProducts.join(",")}></input>

                            {/* Submit */}
                            <button type="submit" className="bg-black hover:bg-gray-800 p-1 text-white w-full rounded-md">Continue to payment</button>
                        </div>
                    </form>

                </div>
            )}
        </>
    )
}