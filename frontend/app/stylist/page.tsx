"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AssignedAppointment {
  id: string;
  date: string;
  timeSlot: string;
  status: string;
  service: { name: string; durationMins: number };
  customer: { firstName: string; lastName: string; phone: string };
}

const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export default function StylistDashboard() {
  const [appointments, setAppointments] = useState<AssignedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/appointments/assigned`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAppointments(data.appointments);
    } catch (err: any) {
      setError(err.message || "Could not load your appointments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`${API}/api/appointments/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    await load();
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <p className="eyebrow">Stylist</p>
      <h1 className="mt-2 text-4xl">My appointments</h1>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-6 text-sm text-ink/50">Loading…</p>}

      {!loading && appointments.length === 0 && !error && (
        <p className="mt-10 text-center text-ink/50">No appointments assigned to you yet.</p>
      )}

      <div className="mt-8 space-y-4">
        {appointments.map((a) => (
          <div key={a.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="font-medium">{a.service.name}</p>
              <p className="text-sm text-ink/50">
                {new Date(a.date).toLocaleDateString()} · {a.timeSlot} · {a.customer.firstName} {a.customer.lastName} ({a.customer.phone})
              </p>
            </div>
            <select
              value={a.status}
              onChange={(e) => updateStatus(a.id, e.target.value)}
              className="rounded-md border border-ink/15 px-3 py-1.5 text-sm"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
