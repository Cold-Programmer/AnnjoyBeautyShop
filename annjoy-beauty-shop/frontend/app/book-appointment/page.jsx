"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import QRCode from "@/components/QRCode";
const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
function BookingForm() {
    const params = useSearchParams();
    const preselectedSlug = params.get("service") ?? "";
    const [apiServices, setApiServices] = useState([]);
    const [stylists, setStylists] = useState([]);
    const [loadError, setLoadError] = useState("");
    const [needsLogin, setNeedsLogin] = useState(false);
    const [serviceId, setServiceId] = useState("");
    const [stylistId, setStylistId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [booked, setBooked] = useState(null);
    // Real services come from the backend — this is what makes the QR
    // code that follows genuinely unique/secure per booking rather than
    // decorative: the appointment (and its qrToken) is a real database row.
    useEffect(() => {
        fetch(`${API}/api/services`, { credentials: "include" })
            .then(async (res) => {
            if (res.status === 401) {
                setNeedsLogin(true);
                return;
            }
            if (!res.ok)
                throw new Error("Failed to load services.");
            const data = await res.json();
            setApiServices(data.items || []);
            const preselected = data.items?.find((s) => s.slug === preselectedSlug);
            if (preselected)
                setServiceId(preselected.id);
        })
            .catch(() => setLoadError("Could not load services from the server. Is the backend running?"));

        fetch(`${API}/api/stylists`, { credentials: "include" })
            .then((res) => (res.ok ? res.json() : { stylists: [] }))
            .then((data) => setStylists(data.stylists || []))
            .catch(() => {}); // non-fatal — booking still works with "any available stylist"
    }, [preselectedSlug]);
    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError("");
        try {
            const res = await fetch(`${API}/api/appointments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ serviceId, stylistId: stylistId || undefined, date, timeSlot: time, notes }),
            });
            const data = await res.json();
            if (!res.ok) {
                setSubmitError(data.message || "Could not book this appointment.");
                return;
            }
            setBooked(data.appointment);
        }
        catch {
            setSubmitError("Could not reach the server.");
        }
        finally {
            setSubmitting(false);
        }
    }
    if (needsLogin) {
        return (<div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-3xl">Log in to book</h1>
        <p className="mt-3 text-ink/60">Create an account or log in to reserve your appointment slot.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/login" className="btn-primary">Log in</Link>
          <Link href="/register" className="btn-secondary">Create account</Link>
        </div>
      </div>);
    }
    if (booked) {
        return (<div className="mx-auto max-w-md px-5 py-16 text-center">
        <h1 className="text-3xl">Booking confirmed ✓</h1>
        <p className="mt-3 text-ink/70">
          {booked.service.name} on {new Date(booked.date).toLocaleDateString()} at {booked.timeSlot}.
        </p>
        <div className="ticket-notch mt-8 inline-block rounded-xl2 border border-ink/10 bg-white p-6 shadow-soft">
          <p className="eyebrow">Your ticket</p>
          <div className="mt-4 flex justify-center">
            <QRCode value={`/appointments/verify/${booked.qrToken}`} size={140}/>
          </div>
          <p className="mt-3 text-xs text-ink/50">
            Show this to your stylist to check in — it's unique to this booking only.
          </p>
        </div>
      </div>);
    }
    return (<div className="mx-auto max-w-xl px-5 py-16">
      <p className="eyebrow">Reserve your slot</p>
      <h1 className="mt-2 text-4xl">Book an appointment</h1>

      {loadError && <p className="mt-4 text-sm text-red-600">{loadError}</p>}

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div>
          <label htmlFor="service" className="text-sm font-medium">Service</label>
          <select id="service" required value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none">
            <option value="" disabled>Select a service</option>
            {apiServices.map((s) => (<option key={s.id} value={s.id}>{s.name} — KES {s.price.toLocaleString()}</option>))}
          </select>
        </div>

        <div>
          <label htmlFor="stylist" className="text-sm font-medium">Stylist</label>
          <select id="stylist" value={stylistId} onChange={(e) => setStylistId(e.target.value)} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none">
            <option value="">Any available stylist</option>
            {stylists.map((s) => (<option key={s.id} value={s.id}>{s.firstName} {s.lastName}{s.title ? ` — ${s.title}` : ""}</option>))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="text-sm font-medium">Date</label>
            <input id="date" type="date" required min={new Date().toISOString().split("T")[0]} value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
          </div>
          <div>
            <label htmlFor="time" className="text-sm font-medium">Time</label>
            <select id="time" required value={time} onChange={(e) => setTime(e.target.value)} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none">
              <option value="" disabled>Select time</option>
              {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="text-sm font-medium">Notes (optional)</label>
          <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
        </div>

        {submitError && <p role="alert" className="text-sm text-red-600">{submitError}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Booking…" : "Request appointment"}
        </button>
      </form>
    </div>);
}
export default function BookAppointmentPage() {
    return (<Suspense fallback={null}>
      <BookingForm />
    </Suspense>);
}
