"use client";
import { useEffect, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ROLES = ["CUSTOMER", "STYLIST", "STAFF", "ADMIN"];
const STATUSES = ["ACTIVE", "SUSPENDED", "FLAGGED", "DELETED"];
export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);
    async function load() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API}/api/admin/users`, { credentials: "include" });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Could not load users.");
                return;
            }
            setUsers(data.users);
        }
        catch {
            setError("Could not reach the server.");
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        load();
    }, []);
    async function changeRole(id, role) {
        setBusyId(id);
        await fetch(`${API}/api/admin/users/${id}/role`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ role }),
        });
        await load();
        setBusyId(null);
    }
    async function changeStatus(id, status) {
        if (status !== "ACTIVE" && !confirm(`Set this account's status to ${status}? This takes effect immediately.`))
            return;
        setBusyId(id);
        await fetch(`${API}/api/admin/users/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ status }),
        });
        await load();
        setBusyId(null);
    }
    function fmt(d) {
        if (!d)
            return "—";
        return new Date(d).toLocaleString();
    }
    return (<div className="mx-auto max-w-6xl px-5 py-16">
      <p className="eyebrow">Admin</p>
      <h1 className="mt-2 text-4xl">Users</h1>
      <p className="mt-2 text-ink/60">
        "Online" means a heartbeat (any authenticated request) in the last 5 minutes. Activity count is
        events logged (logins, page views, moderation actions) — see the ActivityLog model for scope.
      </p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-6 text-sm text-ink/50">Loading…</p>}

      {!loading && !error && (<div className="mt-8 overflow-x-auto rounded-xl2 border border-ink/10 bg-white">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="border-b border-ink/10 bg-ink/[0.02] text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Online</th>
                <th className="px-4 py-3">Last seen</th>
                <th className="px-4 py-3">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {users.map((u) => (<tr key={u.id} className={busyId === u.id ? "opacity-50" : ""}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-ink/40">{u.emailVerified ? "Verified" : "Unverified"}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <p>{u.email}</p>
                    <p className="text-ink/40">{u.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select value={u.role} disabled={busyId === u.id} onChange={(e) => changeRole(u.id, e.target.value)} className="rounded-md border border-ink/15 px-2 py-1 text-xs">
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select value={u.status} disabled={busyId === u.id} onChange={(e) => changeStatus(u.id, e.target.value)} className={`rounded-md border px-2 py-1 text-xs ${u.status === "ACTIVE" ? "border-green-200 text-green-700" : "border-red-200 text-red-700"}`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${u.isOnline ? "bg-green-500" : "bg-ink/20"}`}/>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink/50">{fmt(u.lastSeenAt)}</td>
                  <td className="px-4 py-3 text-xs text-ink/50">
                    {u._count.orders} orders · {u._count.appointments} appts · {u._count.activityLogs} events
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>)}
    </div>);
}
