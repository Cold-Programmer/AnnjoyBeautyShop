"use client";
import { useState } from "react";
import Link from "next/link";
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            await fetch(`${apiUrl}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
        }
        finally {
            // Always show the same confirmation, whether or not the backend call
            // succeeded or the account exists — matches the backend's behavior.
            setSent(true);
            setLoading(false);
        }
    }
    if (sent) {
        return (<div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-3xl">Check your email</h1>
        <p className="mt-3 text-ink/60">
          If an account exists for {email}, we've sent a link to reset your password.
        </p>
        <Link href="/login" className="btn-secondary mt-8 inline-flex">Back to login</Link>
      </div>);
    }
    return (<div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="text-3xl">Reset your password</h1>
      <p className="mt-2 text-sm text-ink/60">Enter your email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        <Link href="/login" className="font-medium text-rosegold-dark hover:underline">Back to login</Link>
      </p>
    </div>);
}
