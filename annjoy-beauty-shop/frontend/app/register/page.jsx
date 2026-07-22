"use client";
import { useState } from "react";
import Link from "next/link";
import { dashboardPathFor } from "@/lib/auth-context";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default function RegisterPage() {
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("form");
    const [code, setCode] = useState("");
    const [resent, setResent] = useState(false);
    function update(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Could not create your account.");
                return;
            }
            setStep("verify"); // account created but unverified — see backend register()
        }
        catch {
            setError("Could not reach the server. Is the backend running?");
        }
        finally {
            setLoading(false);
        }
    }
    async function handleVerify(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: form.email, code }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "That code is incorrect or has expired.");
                return;
            }
            window.location.href = dashboardPathFor(data.user?.role);
        }
        catch {
            setError("Could not reach the server.");
        }
        finally {
            setLoading(false);
        }
    }
    async function handleResend() {
        setError("");
        try {
            await fetch(`${API}/api/auth/resend-verification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email }),
            });
            setResent(true);
        }
        catch {
            setError("Could not reach the server.");
        }
    }
    if (step === "verify") {
        return (<div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
        <h1 className="text-3xl">Check your email</h1>
        <p className="mt-2 text-sm text-ink/60">
          We sent a 6-digit code to <strong>{form.email}</strong>. Enter it below to finish signing up.
        </p>

        <form onSubmit={handleVerify} className="mt-8 space-y-5">
          <div>
            <label htmlFor="code" className="text-sm font-medium">Verification code</label>
            <input id="code" required maxLength={6} inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-center text-2xl tracking-[0.4em] focus:border-rosegold focus:outline-none" placeholder="000000"/>
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading || code.length !== 6} className="btn-primary w-full">
            {loading ? "Verifying…" : "Verify & continue"}
          </button>
        </form>

        <button onClick={handleResend} className="mt-6 text-center text-sm text-rosegold-dark hover:underline">
          {resent ? "Code resent ✓" : "Didn't get a code? Resend it"}
        </button>
      </div>);
    }
    return (<div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="text-3xl">Create your account</h1>
      <p className="mt-2 text-sm text-ink/60">Book appointments and track orders in one place.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="text-sm font-medium">First name</label>
            <input id="firstName" required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
          </div>
          <div>
            <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
            <input id="lastName" required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
          </div>
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium">Phone number</label>
          <input id="phone" required value={form.phone} onChange={(e) => update("phone", e.target.value)} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input id="password" type="password" required minLength={8} value={form.password} onChange={(e) => update("password", e.target.value)} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
        </div>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account? <Link href="/login" className="font-medium text-rosegold-dark hover:underline">Log in</Link>
      </p>
    </div>);
}
