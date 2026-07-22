"use client";
import { useState } from "react";
import Link from "next/link";
import { dashboardPathFor } from "@/lib/auth-context";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [resent, setResent] = useState(false);
    async function handleResend() {
        try {
            await fetch(`${API}/api/auth/resend-verification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            setResent(true);
        }
        catch {
            // silent — the login error message already covers this
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setNeedsVerification(false);
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${apiUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.code === "EMAIL_NOT_VERIFIED") {
                    setNeedsVerification(true);
                }
                setError(data.message || "Invalid email or password.");
                return;
            }
            window.location.href = dashboardPathFor(data.user?.role);
        }
        catch {
            setError("Could not reach the server. Is the backend running?");
        }
        finally {
            setLoading(false);
        }
    }
    return (<div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="text-3xl">Welcome back</h1>
      <p className="mt-2 text-sm text-ink/60">Log in to manage your bookings and orders.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="relative mt-1.5">
            <input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-ink/15 px-4 py-3 pr-16 text-sm focus:border-rosegold focus:outline-none"/>
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/50 hover:text-rosegold-dark">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <Link href="/forgot-password" className="mt-1.5 inline-block text-xs text-rosegold-dark hover:underline">
            Forgot your password?
          </Link>
        </div>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {needsVerification && (<button type="button" onClick={handleResend} className="text-sm font-medium text-rosegold-dark hover:underline">
            {resent ? "Verification code resent ✓" : "Resend verification code"}
          </button>)}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        New here? <Link href="/register" className="font-medium text-rosegold-dark hover:underline">Create an account</Link>
      </p>
    </div>);
}
