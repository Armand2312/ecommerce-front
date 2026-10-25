"use client"
import { useContext, useRef, useState } from "react";
import { InfoIcon } from "../../public/Icons";
import { CartContext } from "./CartContext";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from 'formik';

export default function CartOrderInfo() {
    const { cartProducts } = useContext(CartContext);
    const [submitError, setSubmitError] = useState("");
    const [canRestart, setCanRestart] = useState(false);
    const submitting = useRef(false);
    const attempt = useRef(null);
    const initialValues = { fullname: "", email: "", phoneNumber: "", city: "", postCode: "", address: "", country: "" };

    /* Validation Schema */
    const validationSchema = Yup.object().shape({
        fullname: Yup.string().required("Enter your full name."),
        email: Yup.string().email("Enter a valid email address").required("Email is required"),
        phoneNumber: Yup.string().matches(/^\+?[\d ()-]{5,32}$/, "Enter a valid phone number")
            .test("phone-digits", "Enter a valid phone number", value => {
                const digits = (value || "").replace(/\D/g, "").length;
                return digits >= 5 && digits <= 15;
            }).required("Enter your phone number"),
        city: Yup.string().required("Enter your city."),
        postCode: Yup.string().required("Enter your postcode."),
        address: Yup.string().required("Enter your full address."),
        country: Yup.string().required("Enter your full country."),

    });

    const submitForm = async (values) => {
        if (submitting.current) return;
        submitting.current = true;
        setSubmitError("");
        setCanRestart(false);
        try {
            const data = { ...values, cartProducts: cartProducts.join(",") };
            const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(data)));
            const fingerprint = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
            let saved = attempt.current;
            try { saved ||= JSON.parse(sessionStorage.getItem("checkoutAttempt") || "null"); } catch { /* Optional persistence. */ }
            if (!saved || saved.fingerprint !== fingerprint) saved = { id: crypto.randomUUID(), fingerprint };
            attempt.current = saved;
            try { sessionStorage.setItem("checkoutAttempt", JSON.stringify(saved)); } catch { /* Keep attempt in memory. */ }
            const response = await axios.post("/api/checkout", { ...data, attemptId: saved.id });
            if (!response.data?.url) throw new Error("Missing checkout URL");
            window.location.assign(response.data.url);
        } catch (error) {
            setSubmitError(error.response?.data?.error || "Unable to open payment. Please try again.");
            setCanRestart(error.response?.status === 409);
        } finally {
            submitting.current = false;
        }
    };

    function restartAttempt() {
        attempt.current = null;
        try { sessionStorage.removeItem("checkoutAttempt"); } catch { /* Optional persistence. */ }
        setCanRestart(false);
        setSubmitError("A new checkout attempt is ready. Submit your details again.");
    }
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
                        {({ isSubmitting }) => (
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
                                    <aside aria-label="Test checkout instructions" className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950">
                                        <p className="font-semibold">Test checkout only</p>
                                        <p className="mt-1">Use fictional contact details. Do not enter real card details.</p>
                                        <p className="mt-2">Test card: <span className="inline-block font-mono font-semibold">4242 4242 4242 4242</span></p>
                                        <p>Any future expiry date and any 3-digit CVC.</p>
                                    </aside>
                                    {submitError && <p role="alert" className="text-red-600">{submitError}</p>}
                                    {canRestart && <button type="button" onClick={restartAttempt} className="underline">Start a new checkout attempt</button>}
                                    <button type="submit" disabled={isSubmitting || canRestart} className="bg-black hover:bg-gray-800 disabled:opacity-50 p-1 text-white w-full rounded-md">{isSubmitting ? "Opening payment..." : "Continue to payment"}</button>
                                </div>
                            </Form>
                        )}

                    </Formik>
                </div>
            )}
        </>
    )
}
