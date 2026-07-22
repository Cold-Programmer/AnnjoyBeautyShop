"use client";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import PaymentConfirmedModal from "@/components/PaymentConfirmedModal";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 2 * 60 * 1000;
export default function CheckoutPage() {
    const { lines, subtotal, clear } = useCart();
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [state, setState] = useState("idle");
    const [message, setMessage] = useState("");
    const [receiptNo, setReceiptNo] = useState();
    const [showConfirmed, setShowConfirmed] = useState(false);
    const pollRef = useRef(null);
    const total = subtotal + (subtotal > 0 ? 200 : 0);
    useEffect(() => () => { if (pollRef.current)
        clearInterval(pollRef.current); }, []);
    function startPolling(checkoutRequestId) {
        const startedAt = Date.now();
        pollRef.current = setInterval(async () => {
            if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
                clearInterval(pollRef.current);
                setState("failed");
                setMessage("We didn't hear back in time. Check your phone — if you paid, your order will still confirm shortly.");
                return;
            }
            try {
                const res = await fetch(`${API}/api/mpesa/status/${checkoutRequestId}`, { credentials: "include" });
                const data = await res.json();
                if (data.status === "SUCCESS") {
                    clearInterval(pollRef.current);
                    setReceiptNo(data.mpesaReceiptNumber);
                    setState("success");
                    setShowConfirmed(true); // triggers the pop-up confirmation animation
                    clear();
                }
                else if (data.status === "FAILED" || data.status === "CANCELLED") {
                    clearInterval(pollRef.current);
                    setState("failed");
                    setMessage(data.status === "CANCELLED" ? "Payment was cancelled on your phone." : "Payment failed. Please try again.");
                }
            }
            catch {
                // transient network error — keep polling until timeout
            }
        }, POLL_INTERVAL_MS);
    }
    async function handlePay(e) {
        e.preventDefault();
        setState("sending");
        setMessage("");
        try {
            const res = await fetch(`${API}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    items: lines.map((l) => ({ productId: l.product.id ?? l.product.slug, quantity: l.quantity })),
                    deliveryAddress: address,
                    phone,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.checkoutRequestId) {
                setState("failed");
                setMessage(data.message || "Could not send the payment prompt. Please try again.");
                return;
            }
            setState("waiting");
            setMessage("Check your phone and enter your M-Pesa PIN to complete payment.");
            startPolling(data.checkoutRequestId);
        }
        catch {
            setState("failed");
            setMessage("Network error — is the backend running and reachable?");
        }
    }
    if (lines.length === 0 && state === "idle") {
        return (<div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="text-3xl">Nothing to check out</h1>
        <p className="mt-3 text-ink/60">Add products to your cart first.</p>
      </div>);
    }
    return (<div className="mx-auto max-w-xl px-5 py-16">
      <h1 className="text-3xl">Checkout</h1>
      <p className="mt-2 text-sm text-ink/60">Total due: <span className="font-semibold">KES {total.toLocaleString()}</span></p>

      <form onSubmit={handlePay} className="mt-8 space-y-5">
        <div>
          <label htmlFor="address" className="text-sm font-medium">Delivery address</label>
          <input id="address" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Ndagani shopping centre, near..." className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium">M-Pesa phone number</label>
          <input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0722 503 692" className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
        </div>

        <button type="submit" disabled={state === "sending" || state === "waiting"} className="btn-primary w-full">
          {state === "sending" ? "Sending prompt…" : state === "waiting" ? "Waiting for payment…" : `Pay KES ${total.toLocaleString()} with M-Pesa`}
        </button>

        {message && (<p role="status" className={`text-sm ${state === "failed" ? "text-red-600" : "text-ink/70"}`}>
            {message}
          </p>)}
      </form>

      {showConfirmed && (<PaymentConfirmedModal receiptNo={receiptNo} onClose={() => setShowConfirmed(false)}/>)}
    </div>);
}
