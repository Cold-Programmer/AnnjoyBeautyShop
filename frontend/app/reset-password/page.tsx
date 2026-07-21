"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const token = useSearchParams().get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "This reset link is invalid or has expired.");
        return;
      }
      setDone(true);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-3xl">Invalid link</h1>
        <p className="mt-3 text-ink/60">This password reset link is missing its token.</p>
        <Link href="/forgot-password" className="btn-secondary mt-8 inline-flex">Request a new link</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-3xl">Password updated ✓</h1>
        <p className="mt-3 text-ink/60">You've been logged out everywhere for security. Log in with your new password.</p>
        <Link href="/login" className="btn-primary mt-8 inline-flex">Log in</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="text-3xl">Choose a new password</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="newPassword" className="text-sm font-medium">New password</label>
          <input id="newPassword" type="password" required minLength={8} value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none" />
        </div>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}
