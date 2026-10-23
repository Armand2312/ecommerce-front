"use client";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";

export default function PaymentStatus() {
    const { emptyCart } = useContext(CartContext);
    const [status, setStatus] = useState(null);
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("session_id");
        const attemptId = params.get("attempt_id");
        if (!id && !attemptId) return; // Legacy success flags are never payment evidence.
        const paymentKey = id || attemptId;
        const controller = new AbortController();
        let timer;
        let checks = 0;
        setStatus("checking");
        async function check() {
            try {
                const query = id ? "session_id=" + encodeURIComponent(id) : "attempt_id=" + encodeURIComponent(attemptId);
                const response = await fetch("/api/checkout/status?" + query, {
                    cache: "no-store", signal: controller.signal,
                });
                const result = await response.json();
                if (!response.ok) throw new Error();
                if (controller.signal.aborted) return;
                setStatus(result.status === "unpaid" && params.has("cancel") ? "cancelled" : result.status);
                if (result.status === "paid") {
                    let alreadyCleared = false;
                    try { alreadyCleared = sessionStorage.getItem("clearedPayment") === paymentKey; } catch { /* Optional persistence. */ }
                    if (!alreadyCleared) emptyCart();
                    try {
                        sessionStorage.setItem("clearedPayment", paymentKey);
                        sessionStorage.removeItem("checkoutAttempt");
                    } catch { /* Optional persistence. */ }
                } else if (result.status === "processing" && ++checks < 10) {
                    timer = setTimeout(check, 2000);
                }
            } catch {
                if (!controller.signal.aborted) setStatus("error");
            }
        }
        check();
        return () => { controller.abort(); clearTimeout(timer); };
    }, [emptyCart, retry]);

    const messages = {
        checking: "Checking your test payment...",
        paid: "Test payment confirmed. Your demo order has been placed.",
        processing: "Payment confirmation is still processing. Your cart will stay until confirmation arrives.",
        unpaid: "No payment has been confirmed. You can continue checkout below.",
        cancelled: "Checkout was cancelled. No payment has been confirmed; your cart is unchanged.",
        unsuccessful: "This payment did not complete or the session expired. Your cart is unchanged.",
        error: "We could not verify the payment. Your cart is unchanged. Please check again.",
    };
    if (!status) return null;
    return <div role="status" className="bg-white rounded-md p-3 mx-2 mt-4">
        <p>{messages[status] || messages.error}</p>
        {["processing", "error", "unpaid", "cancelled"].includes(status) &&
            <button type="button" onClick={() => setRetry(value => value + 1)} className="underline mt-2">Check payment again</button>}
    </div>;
}
