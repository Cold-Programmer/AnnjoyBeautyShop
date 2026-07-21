const kpis = [
  { label: "Revenue (this month)", value: "KES 284,500" },
  { label: "Appointments", value: "58" },
  { label: "Orders", value: "112" },
  { label: "New customers", value: "27" },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="eyebrow">Admin</p>
      <h1 className="mt-2 text-4xl">Dashboard</h1>
      <p className="mt-2 text-ink/60">
        Demo view with static KPIs — wire to <code className="rounded bg-ink/5 px-1.5 py-0.5 text-xs">/api/admin/*</code> routes
        (role-guarded, see backend) for live analytics, inventory, staff and settings management.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card p-5">
            <p className="text-2xl font-semibold">{k.value}</p>
            <p className="mt-1 text-sm text-ink/60">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {["Appointments", "Orders", "Inventory"].map((section) => (
          <div key={section} className="card p-6">
            <h2 className="text-lg">{section}</h2>
            <p className="mt-2 text-sm text-ink/60">Manage {section.toLowerCase()} from here.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
