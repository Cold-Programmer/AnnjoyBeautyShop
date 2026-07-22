"use client";

import Link from "next/link";

const kpis = [
  {
    label: "Revenue (This Month)",
    value: "KES 284,500",
    href: "/admin/reports",
    color: "bg-pink-100",
  },
  {
    label: "Appointments",
    value: "58",
    href: "/admin/appointments",
    color: "bg-blue-100",
  },
  {
    label: "Orders",
    value: "112",
    href: "/admin/orders",
    color: "bg-green-100",
  },
  {
    label: "New Customers",
    value: "27",
    href: "/admin/customers",
    color: "bg-yellow-100",
  },
];

const quickActions = [
  { title: "Products", href: "/admin/products" },
  { title: "Inventory", href: "/admin/inventory" },
  { title: "Orders", href: "/admin/orders" },
  { title: "Appointments", href: "/admin/appointments" },
  { title: "Customers", href: "/admin/customers" },
  { title: "Staff", href: "/admin/staff" },
  { title: "Stylists", href: "/admin/stylists" },
  { title: "Analytics", href: "/admin/analytics" },
  { title: "Reports", href: "/admin/reports" },
  { title: "Settings", href: "/admin/settings" },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navbar */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-pink-600">
            Glow 'N' Go Admin
          </h1>

          <div className="flex gap-3">
            <button className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-black transition">
              🌙 Dark Mode
            </button>

            <Link
              href="/"
              className="rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700 transition"
            >
              View Website
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">

        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r min-h-screen">
          <div className="p-6">
            <h2 className="font-bold text-lg mb-5">
              Navigation
            </h2>

            <nav className="space-y-2">

              {quickActions.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block rounded-lg px-4 py-3 hover:bg-pink-100 hover:text-pink-600 transition"
                >
                  {item.title}
                </Link>
              ))}

            </nav>
          </div>
        </aside>

        {/* Main Content */}

        <main className="flex-1 p-8">

          <h2 className="text-4xl font-bold">
            Admin Dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            Welcome back. Monitor your beauty shop,
            appointments, orders, products and staff.
          </p>

          {/* KPI Cards */}

          <div className="grid gap-6 mt-8 sm:grid-cols-2 xl:grid-cols-4">

            {kpis.map((item) => (

              <Link
                key={item.label}
                href={item.href}
                className={`${item.color} rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300`}
              >

                <h3 className="text-3xl font-bold">
                  {item.value}
                </h3>

                <p className="mt-2 text-gray-600">
                  {item.label}
                </p>

              </Link>

            ))}

          </div>

          {/* Quick Buttons */}

          <div className="mt-10">

            <h3 className="text-2xl font-semibold mb-4">
              Quick Actions
            </h3>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">

              {quickActions.map((action) => (

                <Link
                  key={action.title}
                  href={action.href}
                  className="rounded-lg bg-pink-600 text-white p-4 text-center hover:bg-pink-700 hover:scale-105 transition"
                >
                  {action.title}
                </Link>

              ))}

            </div>

          </div>

          {/* Recent Activity */}

          <div className="mt-12 bg-white rounded-xl shadow p-6">

            <h3 className="text-xl font-semibold mb-5">
              Recent Activity
            </h3>

            <ul className="space-y-3">

              <li>✅ New appointment booked.</li>

              <li>✅ New customer registered.</li>

              <li>✅ Payment received.</li>

              <li>⚠️ Low stock alert for Lipstick.</li>

              <li>📦 Order #1024 awaiting delivery.</li>

            </ul>

          </div>

        </main>

      </div>

    </div>
  );
}