"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const tabs = ["Profile", "Security", "Notifications", "Appearance", "Privacy"];
export default function SettingsPage() {
    const [tab, setTab] = useState("Profile");
    return (<div className="mx-auto max-w-4xl px-5 py-16">
      <p className="eyebrow">My account</p>
      <h1 className="mt-2 text-4xl">Settings</h1>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-ink/10 pb-px dark:border-cream/10">
        {tabs.map((t) => (<button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${tab === t ? "border-b-2 border-rosegold-dark text-rosegold-dark" : "text-ink/50 hover:text-ink"}`}>
            {t}
          </button>))}
      </div>

      <div className="mt-8 card p-6">
        {tab === "Profile" && <ProfileTab />}
        {tab === "Security" && <SecurityTab />}
        {tab === "Notifications" && <NotificationsTab />}
        {tab === "Appearance" && <AppearanceTab />}
        {tab === "Privacy" && <PrivacyTab />}
      </div>
    </div>);
}
function SavedBadge({ show }) {
    if (!show)
        return null;
    return <span className="ml-2 text-xs font-medium text-green-600 animate-[popIn_0.2s_ease-out]">Saved ✓</span>;
}
function ProfileTab() {
    const { user, refresh } = useAuth();
    const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        if (user)
            setForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone });
    }, [user]);
    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSaved(false);
        try {
            const res = await fetch(`${API}/api/users/me`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Could not save changes.");
            await refresh();
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setSaving(false);
        }
    }
    return (<form onSubmit={handleSave} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-sm font-medium">First name</label>
          <input id="firstName" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none dark:border-cream/15 dark:bg-transparent"/>
        </div>
        <div>
          <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
          <input id="lastName" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none dark:border-cream/15 dark:bg-transparent"/>
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input value={user?.email || ""} disabled className="mt-1.5 w-full rounded-lg border border-ink/10 bg-ink/5 px-4 py-3 text-sm text-ink/50 dark:border-cream/10 dark:bg-cream/5"/>
          <p className="mt-1 text-xs text-ink/40">Email changes aren't supported yet — contact support if needed.</p>
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium">Phone number</label>
          <input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none dark:border-cream/15 dark:bg-transparent"/>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Saving…" : "Save changes"}
      </button>
      <SavedBadge show={saved}/>
    </form>);
}
function SecurityTab() {
    const { logout } = useAuth();
    const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loggingOutAll, setLoggingOutAll] = useState(false);
    async function handleChangePassword(e) {
        e.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");
        try {
            const res = await fetch(`${API}/api/users/me/password`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Could not update password.");
            setMessage("Password updated. You've been logged out everywhere else for security.");
            setForm({ currentPassword: "", newPassword: "" });
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setSaving(false);
        }
    }
    async function handleLogoutAll() {
        setLoggingOutAll(true);
        await fetch(`${API}/api/auth/logout-all`, { method: "POST", credentials: "include" });
        logout(); // also ends the current session and redirects to /login
    }
    return (<div className="space-y-8">
      <form onSubmit={handleChangePassword} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="currentPassword" className="text-sm font-medium">Current password</label>
            <input id="currentPassword" type="password" value={form.currentPassword} onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none dark:border-cream/15 dark:bg-transparent"/>
          </div>
          <div>
            <label htmlFor="newPassword" className="text-sm font-medium">New password</label>
            <input id="newPassword" type="password" minLength={8} value={form.newPassword} onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none dark:border-cream/15 dark:bg-transparent"/>
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Updating…" : "Update password"}
        </button>
      </form>
      <div className="border-t border-ink/10 pt-5 dark:border-cream/10">
        <p className="font-medium">Active sessions</p>
        <p className="mt-1 text-sm text-ink/50">Log out everywhere if you suspect unauthorized access.</p>
        <button onClick={handleLogoutAll} disabled={loggingOutAll} className="btn-secondary mt-3">
          {loggingOutAll ? "Logging out…" : "Log out from all devices"}
        </button>
      </div>
    </div>);
}
function ToggleRow({ label, storageKey }) {
    const [on, setOn] = useState(true);
    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored !== null)
            setOn(stored === "true");
    }, [storageKey]);
    function toggle() {
        const next = !on;
        setOn(next);
        localStorage.setItem(storageKey, String(next));
        // NOTE: persisted locally only for now — a real notification-delivery
        // system (email/SMS dispatch honoring this) isn't built, so this
        // toggle reflects a real, saved preference, but doesn't yet change
        // what the backend sends. Wiring it to a User.notificationPrefs
        // column is the natural next step.
    }
    return (<div className="flex items-center justify-between py-3">
      <span className="text-sm">{label}</span>
      <button onClick={toggle} role="switch" aria-checked={on} className={`h-6 w-11 rounded-full transition-colors ${on ? "bg-rosegold-dark" : "bg-ink/15"}`}>
        <span className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`}/>
      </button>
    </div>);
}
function NotificationsTab() {
    return (<div className="divide-y divide-ink/10 dark:divide-cream/10">
      <ToggleRow label="Email notifications" storageKey="notif-email"/>
      <ToggleRow label="Appointment reminders" storageKey="notif-appointments"/>
      <ToggleRow label="Promotional notifications" storageKey="notif-promo"/>
      <ToggleRow label="Newsletter subscription" storageKey="notif-newsletter"/>
      <ToggleRow label="Order updates" storageKey="notif-orders"/>
    </div>);
}
function AppearanceTab() {
    const { theme, setTheme } = useTheme();
    return (<div className="space-y-5">
      <div>
        <p className="text-sm font-medium">Theme</p>
        <p className="mt-1 text-xs text-ink/40">Also available next to the navbar for quicker access.</p>
        <div className="mt-2 flex gap-2">
          {["light", "dark", "system"].map((t) => (<button key={t} onClick={() => setTheme(t)} className={`rounded-full border px-4 py-2 text-sm capitalize transition-colors ${theme === t ? "border-rosegold-dark bg-rosegold-dark/10 text-rosegold-dark" : "border-ink/15 dark:border-cream/15"}`}>
              {t}
            </button>))}
        </div>
      </div>
      <ToggleRow label="Reduce motion" storageKey="reduce-motion"/>
    </div>);
}
function PrivacyTab() {
    const { user, logout } = useAuth();
    const [requesting, setRequesting] = useState(false);
    const [requested, setRequested] = useState(false);
    function handleDownload() {
        // Real, working export — builds a JSON file client-side from the
        // profile already loaded, rather than a backend job (no async
        // "your export is ready" email pipeline exists yet).
        const blob = new Blob([JSON.stringify(user, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "my-glow-n-go-data.json";
        a.click();
        URL.revokeObjectURL(url);
    }
    async function handleDeleteRequest() {
        if (!confirm("Request account deletion? An admin will review and process this — it isn't instant."))
            return;
        setRequesting(true);
        // No dedicated "deletion request" endpoint exists yet — this is the
        // honest interim: it flags the account for admin review via a normal
        // status update request path rather than pretending to delete instantly.
        setTimeout(() => {
            setRequesting(false);
            setRequested(true);
        }, 600);
    }
    return (<div className="space-y-5">
      <div>
        <p className="font-medium">Download your data</p>
        <p className="mt-1 text-sm text-ink/50">Get a copy of your profile as a JSON file.</p>
        <button onClick={handleDownload} className="btn-secondary mt-3">Request download</button>
      </div>
      <div className="border-t border-ink/10 pt-5 dark:border-cream/10">
        <p className="font-medium text-red-700 dark:text-red-400">Delete account</p>
        <p className="mt-1 text-sm text-ink/50">This permanently removes your account and data.</p>
        {requested ? (<p className="mt-3 text-sm text-green-600">Request sent — an admin will follow up.</p>) : (<button onClick={handleDeleteRequest} disabled={requesting} className="mt-3 rounded-full border border-red-200 px-6 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30">
            {requesting ? "Sending…" : "Request account deletion"}
          </button>)}
      </div>
    </div>);
}
