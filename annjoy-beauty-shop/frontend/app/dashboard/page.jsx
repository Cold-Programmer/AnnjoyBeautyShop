"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default function DashboardPage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        Promise.all([
            fetch(`${API}/api/appointments/me`, { credentials: "include" }).then((r) => r.json()),
            fetch(`${API}/api/orders/me`, { credentials: "include" }).then((r) => r.json()),
        ])
            .then(([appts, ords]) => {
            setAppointments(appts.appointments || []);
            setOrders(ords.orders || []);
        })
            .finally(() => setLoading(false));
    }, []);
    const upcoming = appointments.filter((a) => ["PENDING", "CONFIRMED"].includes(a.status));
    const nextAppointment = upcoming[0];
    return (<div className="mx-auto max-w-5xl px-5 py-16">
      <p className="eyebrow">My account</p>
      <h1 className="mt-2 text-4xl">Welcome back{user ? `, ${user.firstName}` : ""}</h1>

      {loading ? (<p className="mt-6 text-sm text-ink/50">Loading your data…</p>) : (<>
          {/* Each card is now a real link to where that data actually lives —
                previously these were static numbers with nowhere to go. */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="#appointments" className="card p-5 transition-transform hover:-translate-y-1">
              <p className="text-2xl font-semibold">{upcoming.length}</p>
              <p className="mt-1 text-sm text-ink/60">Upcoming appointments</p>
            </Link>
            <Link href="#orders" className="card p-5 transition-transform hover:-translate-y-1">
              <p className="text-2xl font-semibold">{orders.length}</p>
              <p className="mt-1 text-sm text-ink/60">Orders</p>
            </Link>
            <Link href="/shop" className="card p-5 transition-transform hover:-translate-y-1">
              <p className="text-2xl font-semibold">→</p>
              <p className="mt-1 text-sm text-ink/60">Continue shopping</p>
            </Link>
          </div>

          <div id="appointments" className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="card p-6">
              <h2 className="text-lg">Next appointment</h2>
              {nextAppointment ? (<div className="mt-4 flex items-center justify-between rounded-lg border border-ink/10 p-4 dark:border-cream/10">
                  <div>
                    <p className="font-medium">{nextAppointment.service.name}</p>
                    <p className="text-sm text-ink/50">
                      {new Date(nextAppointment.date).toLocaleDateString()} · {nextAppointment.timeSlot}
                      {nextAppointment.stylist && ` · with ${nextAppointment.stylist.firstName} ${nextAppointment.stylist.lastName}`}
                    </p>
                  </div>
                  <Link href="/book-appointment" className="text-sm font-medium text-rosegold-dark hover:underline">
                    Book another
                  </Link>
                </div>) : (<div className="mt-4 rounded-lg border border-dashed border-ink/15 p-6 text-center text-sm text-ink/50 dark:border-cream/15">
                  No upcoming appointments.
                  <Link href="/book-appointment" className="mt-2 block font-medium text-rosegold-dark hover:underline">
                    Book one now →
                  </Link>
                </div>)}
            </div>

            <div id="orders" className="card p-6">
              <h2 className="text-lg">Recent orders</h2>
              {orders.length > 0 ? (<ul className="mt-4 space-y-3 text-sm">
                  {orders.slice(0, 5).map((o) => (<li key={o.id} className="flex items-center justify-between">
                      <Link href={`/orders/${o.id}`} className="hover:text-rosegold-dark hover:underline">
                        Order #{o.id.slice(-6).toUpperCase()}
                      </Link>
                      <span className="text-ink/50">{o.status} · KES {o.total.toLocaleString()}</span>
                    </li>))}
                </ul>) : (<div className="mt-4 rounded-lg border border-dashed border-ink/15 p-6 text-center text-sm text-ink/50 dark:border-cream/15">
                  No orders yet.
                  <Link href="/shop" className="mt-2 block font-medium text-rosegold-dark hover:underline">
                    Start shopping →
                  </Link>
                </div>)}
            </div>
          </div>

          <div className="mt-10 card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg">Settings</h2>
                <p className="mt-1 text-sm text-ink/60">Profile, security, notifications, appearance and privacy.</p>
              </div>
              <Link href="/settings" className="btn-secondary">Open settings</Link>
            </div>
          </div>
        </>)}
    </div>);
}
