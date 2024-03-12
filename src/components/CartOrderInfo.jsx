"use client"
import { useContext, useEffect, useState } from "react";
import { InfoIcon } from "../../public/Icons";
import { CartContext } from "./CartContext";
import axios from "axios";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from 'formik';

export default function CartOrderInfo() {
    const { cartProducts, emptyCart } = useContext(CartContext);
    const [fullname, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [city, setCity] = useState("");
    const [postCode, setPostCode] = useState("");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");
    const router = useRouter();

    const initialValues = {
        fullname: fullname,
        email: email,
        phoneNumber: phoneNumber,
        city: city,
        postCode: postCode,
        address: address,
        country: country,
    }

    /* Validation Schema */
    const validationSchema = Yup.object().shape({
        fullname: Yup.string().required("Enter your full name."),
        email: Yup.string().email("Enter a valid email address").required("Email is required"),
        phoneNumber: Yup.number().required("Enter your phone number"),
        city: Yup.string().required("Enter your city."),
        postCode: Yup.string().required("Enter your postcode."),
        address: Yup.string().required("Enter your full address."),
        country: Yup.string().required("Enter your full country."),

    });

    /* Submit Form */
    const submitForm = async (values) => {
        /* ev.preventDefault(); */
        console.log(values);
        const data = {
            fullname: values.fullname,
            email: values.email,
            phoneNumber: values.phoneNumber,
            city: values.city,
            postCode: values.postCode,
            address: values.address,
            country: values.country,
            cartProducts: cartProducts.join(",")
        }
        axios.post("/api/checkout", data).then(response => {
            console.log(response);
            if (response?.data.url) {
                console.log(response.data.url);
                router.push(response.data.url);
            }
        })
    }

    /* Payment Success Message */
    useEffect(() => {
        if (window.location.href.includes("success")) {
            /* Empty Cart */
            emptyCart();
            toast.success("Payment successful, order placed. Check your email for your receipt.",
                {
                    position: "top-right",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
        }
    }, [])


    return (
        <>
            {/* Hide on empty cart */}
            {!cartProducts.length ? (
                <></>
            ) : (
                <div className="bg-white rounded-md p-2">
                    <div className="flex items-center mb-2">
                        <InfoIcon sizes={22} color={"black"} />
                        <h1 className="ml-2 font-semibold text-xl">Order Information</h1>
                    </div>


                    <Formik initialValues={initialValues} onSubmit={submitForm} validationSchema={validationSchema}>
                        {({ errors, touched }) => (
                            <Form>
                                <div className="flex flex-col space-y-2 p-2">

                                    {/* Name */}
                                    <div>
                                        <label className="flex flex-col">Name
                                            <Field name="fullname" className="border border-gray-400 rounded-md p-1" placeholder="Name" autoComplete="name"></Field>
                                        </label>
                                        <div className="text-red-600">
                                            <ErrorMessage name="fullname" />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="flex flex-col">Email
                                            <Field name="email" className="border border-gray-400 rounded-md p-1" placeholder="Email" autoComplete="email"></Field>
                                        </label>
                                        <div className="text-red-600">
                                            <ErrorMessage name="email" />
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="flex flex-col">Phone Number
                                            <Field name="phoneNumber" className="border border-gray-400 rounded-md p-1" placeholder="Phone Number" autoComplete="tel"></Field>
                                        </label>
                                        <div className="text-red-600">
                                            <ErrorMessage name="phoneNumber" />
                                        </div>
                                    </div>

                                    {/* City & Post Code */}
                                    <div className="flex md:flex-row md:gap-1 flex-col space-y-2 md:space-y-0">
                                        <div className="flex flex-col">
                                            <label className="flex flex-col md:w-full">City
                                                <Field name="city" className="border border-gray-400 rounded-md p-1" placeholder="City" autoComplete="address-level2"></Field>
                                            </label>
                                            <div className="text-red-600">
                                                <ErrorMessage name="city" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="flex flex-col md:w-full">Post Code
                                                <Field name="postCode" className="border border-gray-400 rounded-md p-1" placeholder="Post Code" autoComplete="postal-code"></Field>
                                            </label>
                                            <div className="text-red-600">
                                                <ErrorMessage name="postCode" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="flex flex-col">Address
                                            <Field name="address" className="border border-gray-400 rounded-md p-1" placeholder="Address" autoComplete="address"></Field>
                                        </label>
                                        <div className="text-red-600">
                                            <ErrorMessage name="address" />
                                        </div>
                                    </div>

                                    {/* Country */}
                                    <div>
                                        <label className="flex flex-col">Country
                                            <Field name="country" className="border border-gray-400 rounded-md p-1" placeholder="Country" autoComplete="address-level1"></Field>
                                        </label>
                                        <div className="text-red-600">
                                            <ErrorMessage name="country" />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button type="submit" className="bg-black hover:bg-gray-800 p-1 text-white w-full rounded-md">Continue to payment</button>
                                </div>
                            </Form>
                        )}

                    </Formik>
                </div>
            )}
        </>
    )
}