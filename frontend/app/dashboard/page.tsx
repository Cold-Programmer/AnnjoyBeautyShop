import Link from "next/link";

const stats = [
  { label: "Upcoming appointments", value: "1" },
  { label: "Orders", value: "3" },
  { label: "Wishlist items", value: "5" },
  { label: "Loyalty points", value: "240" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="eyebrow">My account</p>
      <h1 className="mt-2 text-4xl">Welcome back</h1>
      <p className="mt-2 text-ink/60">
        This dashboard reads from mock data for demo purposes — wire it to
        <code className="mx-1 rounded bg-ink/5 px-1.5 py-0.5 text-xs">GET /api/users/me</code>,
        <code className="mx-1 rounded bg-ink/5 px-1.5 py-0.5 text-xs">/api/appointments</code> and
        <code className="mx-1 rounded bg-ink/5 px-1.5 py-0.5 text-xs">/api/orders</code> for live data.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="mt-1 text-sm text-ink/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg">Next appointment</h2>
          <div className="mt-4 flex items-center justify-between rounded-lg border border-ink/10 p-4">
            <div>
              <p className="font-medium">Bridal Makeup</p>
              <p className="text-sm text-ink/50">Sat, 12:00 PM · with Claudia Mwende</p>
            </div>
            <Link href="/book-appointment" className="text-sm font-medium text-rosegold-dark hover:underline">
              Reschedule
            </Link>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg">Recent orders</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between"><span>Order #A1042</span><span className="text-ink/50">Delivered</span></li>
            <li className="flex justify-between"><span>Order #A1038</span><span className="text-ink/50">Processing</span></li>
            <li className="flex justify-between"><span>Order #A1029</span><span className="text-ink/50">Delivered</span></li>
          </ul>
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
    </div>
  );
}
