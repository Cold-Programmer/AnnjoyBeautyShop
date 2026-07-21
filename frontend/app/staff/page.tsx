import Link from "next/link";

export default function StaffDashboard() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <p className="eyebrow">Staff</p>
      <h1 className="mt-2 text-4xl">Staff dashboard</h1>
      <p className="mt-2 text-ink/60">Manage inventory and orders. Full analytics/reporting are not built yet — see README.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Link href="/admin/products" className="card block p-6">
          <h2 className="text-lg">Products & inventory</h2>
          <p className="mt-1 text-sm text-ink/60">Add products, update stock, toggle visibility.</p>
        </Link>
        <div className="card p-6">
          <h2 className="text-lg">Orders</h2>
          <p className="mt-1 text-sm text-ink/60">
            Order status updates are available via <code className="rounded bg-ink/5 px-1 py-0.5 text-xs">PATCH /api/orders/:id/status</code> —
            a dedicated orders table UI is the natural next addition here.
          </p>
        </div>
      </div>
    </div>
  );
}
