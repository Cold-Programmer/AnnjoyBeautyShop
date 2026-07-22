"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Receipt from "@/components/Receipt";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default function OrderReceiptPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    useEffect(() => {
        fetch(`${API}/api/orders/${id}`, { credentials: "include" })
            .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Order not found.");
                return;
            }
            setOrder(data.order);
        })
            .catch(() => setError("Could not reach the server."));
    }, [id]);
    return (<div className="mx-auto max-w-xl px-5 py-16">
      <h1 className="text-3xl">Receipt</h1>
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {order && (<div id="receipt-print" className="mt-8">
          <Receipt order={order}/>
        </div>)}
    </div>);
}
