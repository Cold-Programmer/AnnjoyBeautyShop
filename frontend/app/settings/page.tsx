"use client";

import { useState } from "react";

const tabs = ["Profile", "Security", "Notifications", "Appearance", "Privacy"] as const;
type Tab = (typeof tabs)[number];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Profile");

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <p className="eyebrow">My account</p>
      <h1 className="mt-2 text-4xl">Settings</h1>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-ink/10 pb-px">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t ? "border-b-2 border-rosegold-dark text-rosegold-dark" : "text-ink/50 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8 card p-6">
        {tab === "Profile" && <ProfileTab />}
        {tab === "Security" && <SecurityTab />}
        {tab === "Notifications" && <NotificationsTab />}
        {tab === "Appearance" && <AppearanceTab />}
        {tab === "Privacy" && <PrivacyTab />}
      </div>
    </div>
  );
}

function Field({ label, id, type = "text" }: { label: string; id: string; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <input id={id} type={type} className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none" />
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-ink/50">
        Wire this form to <code className="rounded bg-ink/5 px-1.5 py-0.5 text-xs">PATCH /api/users/me</code> (add that route to the backend when ready).
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" id="firstName" />
        <Field label="Last name" id="lastName" />
        <Field label="Email" id="email" type="email" />
        <Field label="Phone number" id="phone" />
        <Field label="City" id="city" />
        <Field label="Country" id="country" />
      </div>
      <button className="btn-primary">Save changes</button>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Current password" id="currentPassword" type="password" />
        <Field label="New password" id="newPassword" type="password" />
      </div>
      <button className="btn-primary">Update password</button>
      <div className="border-t border-ink/10 pt-5">
        <p className="font-medium">Active sessions</p>
        <p className="mt-1 text-sm text-ink/50">Log out everywhere if you suspect unauthorized access.</p>
        <button className="btn-secondary mt-3">Log out from all devices</button>
      </div>
    </div>
  );
}

function ToggleRow({ label }: { label: string }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm">{label}</span>
      <button
        onClick={() => setOn((o) => !o)}
        role="switch"
        aria-checked={on}
        className={`h-6 w-11 rounded-full transition-colors ${on ? "bg-rosegold-dark" : "bg-ink/15"}`}
      >
        <span className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="divide-y divide-ink/10">
      <ToggleRow label="Email notifications" />
      <ToggleRow label="Appointment reminders" />
      <ToggleRow label="Promotional notifications" />
      <ToggleRow label="Newsletter subscription" />
      <ToggleRow label="Order updates" />
    </div>
  );
}

function AppearanceTab() {
  const [theme, setTheme] = useState("system");
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium">Theme</p>
        <div className="mt-2 flex gap-2">
          {["light", "dark", "system"].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`rounded-full border px-4 py-2 text-sm capitalize ${
                theme === t ? "border-rosegold-dark bg-rosegold-dark/10 text-rosegold-dark" : "border-ink/15"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink/40">Dark mode theming can be wired up via a `dark:` Tailwind variant + this preference.</p>
      </div>
      <ToggleRow label="Reduce motion" />
    </div>
  );
}

function PrivacyTab() {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-medium">Download your data</p>
        <p className="mt-1 text-sm text-ink/50">Get a copy of your profile, orders, and appointment history.</p>
        <button className="btn-secondary mt-3">Request download</button>
      </div>
      <div className="border-t border-ink/10 pt-5">
        <p className="font-medium text-red-700">Delete account</p>
        <p className="mt-1 text-sm text-ink/50">This permanently removes your account and data.</p>
        <button className="mt-3 rounded-full border border-red-200 px-6 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50">
          Request account deletion
        </button>
      </div>
    </div>
  );
}
