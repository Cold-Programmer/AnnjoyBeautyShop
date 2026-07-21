"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AppointmentDetail {
  id: string;
  status: string;
  date: string;
  timeSlot: string;
  service: { name: string; durationMins: number };
  stylist: { firstName: string; lastName: string; title: string | null } | null;
  customer: { firstName: string; lastName: string; phone: string };
}

/**
 * Page a staff/stylist member lands on after scanning a customer's
 * ticket QR. Reading the appointment is public (the qrToken itself is
 * the secret — see schema.prisma), but actually confirming check-in
 * requires a STAFF/STYLIST/ADMIN session, enforced server-side.
 */
export default function VerifyAppointmentPage() {
  const { token } = useParams<{ token: string }>();
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/appointments/verify/${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "This QR code is invalid or has expired.");
          return;
        }
        setAppointment(data.appointment);
      })
      .catch(() => setError("Could not reach the server."));
  }, [token]);

  async function handleConfirm() {
    setConfirming(true);
    try {
      const res = await fetch(`${API}/api/appointments/verify/${token}/confirm`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not confirm this appointment.");
        return;
      }
      setConfirmed(true);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="eyebrow">Check-in</p>
      <h1 className="mt-2 text-3xl">Appointment ticket</h1>

      {error && (
        <div className="mt-8 rounded-xl2 border border-red-200 bg-red-50 p-6 text-center text-red-700">
          {error}
        </div>
      )}

      {appointment && (
        <div className="card mt-8 p-6">
          <p className="text-lg font-medium">{appointment.service.name}</p>
          <p className="mt-1 text-sm text-ink/60">
            {new Date(appointment.date).toLocaleDateString()} · {appointment.timeSlot} · {appointment.service.durationMins} mins
          </p>
          <div className="my-4 border-t border-dashed border-ink/15" />
          <p className="text-sm"><span className="text-ink/50">Client:</span> {appointment.customer.firstName} {appointment.customer.lastName}</p>
          <p className="text-sm"><span className="text-ink/50">Phone:</span> {appointment.customer.phone}</p>
          {appointment.stylist && (
            <p className="text-sm"><span className="text-ink/50">Stylist:</span> {appointment.stylist.firstName} {appointment.stylist.lastName}</p>
          )}
          <p className="mt-3 text-sm">
            <span className="text-ink/50">Status:</span>{" "}
            <span className="font-medium">{confirmed ? "CONFIRMED" : appointment.status}</span>
          </p>

          {!confirmed && (
            <button onClick={handleConfirm} disabled={confirming} className="btn-primary mt-6 w-full">
              {confirming ? "Confirming…" : "Confirm check-in"}
            </button>
          )}
          {confirmed && (
            <div className="mt-6 rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-700">
              Checked in ✓
            </div>
          )}
          <p className="mt-3 text-center text-xs text-ink/40">
            Only staff, stylist, or admin accounts can confirm check-in — logged-in customers or guests will see an error if they try.
          </p>
        </div>
      )}
    </div>
  );
}
