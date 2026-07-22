"use client";

import { useState } from "react";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("Sales Analytics");

  // Sample data for Sales Analytics
  const [salesData, setSalesData] = useState([
    { id: 1, period: "This Week", totalSales: 142, revenueGenerated: "$4,520.00", growth: "+12%" },
    { id: 2, period: "This Month", totalSales: 610, revenueGenerated: "$19,850.00", growth: "+18%" },
    { id: 3, period: "This Year", totalSales: 7420, revenueGenerated: "$245,000.00", growth: "+25%" },
  ]);

  // Sample data for Revenue Reports
  const [revenueReports, setRevenueReports] = useState([
    { id: 1, category: "Peripherals", revenue: "$8,400.00", percentage: "42%" },
    { id: 2, category: "Services & Appointments", revenue: "$7,200.00", percentage: "36%" },
    { id: 3, category: "Accessories", revenue: "$4,250.00", percentage: "22%" },
  ]);

  // Sample data for Customer Growth
  const [customerGrowth, setCustomerGrowth] = useState([
    { id: 1, month: "April 2026", newCustomers: 85, activeCustomers: 410 },
    { id: 2, month: "May 2026", newCustomers: 112, activeCustomers: 490 },
    { id: 3, month: "June 2026", newCustomers: 145, activeCustomers: 580 },
  ]);

  // Sample data for Popular Products
  const [popularProducts, setPopularProducts] = useState([
    { id: 1, name: "Wireless Mouse", unitsSold: 210, totalRevenue: "$5,250.00" },
    { id: 2, name: "Mechanical Keyboard", unitsSold: 140, totalRevenue: "$10,500.00" },
    { id: 3, name: "USB-C Hub", unitsSold: 95, totalRevenue: "$2,850.00" },
  ]);

  // Sample data for Appointment Statistics
  const [appointmentStats, setAppointmentStats] = useState([
    { id: 1, service: "Haircut & Styling", completed: 320, cancelled: 15 },
    { id: 2, service: "Bridal Makeup", completed: 85, cancelled: 4 },
    { id: 3, service: "Beard Trim", completed: 190, cancelled: 8 },
  ]);

  // Interactive filter/update state for Sales Analytics
  const [newPeriod, setNewPeriod] = useState("");
  const [newSalesCount, setNewSalesCount] = useState("");
  const [newRevenueAmount, setNewRevenueAmount] = useState("");

  const handleAddSalesRecord = (e) => {
    e.preventDefault();
    if (!newPeriod || !newSalesCount || !newRevenueAmount) return;

    const newRecord = {
      id: Date.now(),
      period: newPeriod,
      totalSales: parseInt(newSalesCount, 10),
      revenueGenerated: `$${parseFloat(newRevenueAmount).toFixed(2)}`,
      growth: "+10%",
    };

    setSalesData([...salesData, newRecord]);
    setNewPeriod("");
    setNewSalesCount("");
    setNewRevenueAmount("");
  };

  const buttons = [
    "Sales Analytics",
    "Revenue Reports",
    "Customer Growth",
    "Popular Products",
    "Appointment Statistics",
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="mt-3 text-gray-600">
        Monitor business performance analytics, revenue, customer growth, and appointment statistics seamlessly.
      </p>

      {/* Interactive Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => setActiveTab(btn)}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              activeTab === btn
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {btn}
          </button>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="mt-8 rounded-xl border bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">{activeTab}</h2>

        {/* Sales Analytics Tab */}
        {activeTab === "Sales Analytics" && (
          <div className="mt-4 space-y-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="p-3">Time Period</th>
                    <th className="p-3">Total Sales Count</th>
                    <th className="p-3">Revenue Generated</th>
                    <th className="p-3">Growth Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{s.period}</td>
                      <td className="p-3">{s.totalSales} orders</td>
                      <td className="p-3 font-semibold text-green-600">{s.revenueGenerated}</td>
                      <td className="p-3 font-semibold text-blue-600">{s.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Form to add/update custom sales metrics */}
            <form onSubmit={handleAddSalesRecord} className="border-t pt-6 max-w-xl space-y-4">
              <h3 className="font-semibold text-gray-800">Add Sales Metric Record</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Period Name</label>
                <input
                  type="text"
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Q3 2026"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Sales Count</label>
                  <input
                    type="number"
                    value={newSalesCount}
                    onChange={(e) => setNewSalesCount(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. 350"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Revenue Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newRevenueAmount}
                    onChange={(e) => setNewRevenueAmount(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. 12500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
              >
                Add Record
              </button>
            </form>
          </div>
        )}

        {/* Revenue Reports Tab */}
        {activeTab === "Revenue Reports" && (
          <div className="mt-4 overflow-x-auto">
            <p className="text-sm text-gray-500 mb-4">Breakdown of earnings generated across categories.</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Category</th>
                  <th className="p-3">Revenue</th>
                  <th className="p-3">Share Percentage</th>
                </tr>
              </thead>
              <tbody>
                {revenueReports.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{r.category}</td>
                    <td className="p-3 font-semibold text-green-600">{r.revenue}</td>
                    <td className="p-3">
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                        {r.percentage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Customer Growth Tab */}
        {activeTab === "Customer Growth" && (
          <div className="mt-4 overflow-x-auto">
            <p className="text-sm text-gray-500 mb-4">Monthly tracking of acquisition rates and active base.</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Month</th>
                  <th className="p-3">New Customers Acquired</th>
                  <th className="p-3">Total Active Customers</th>
                </tr>
              </thead>
              <tbody>
                {customerGrowth.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{c.month}</td>
                    <td className="p-3 text-green-600 font-semibold">+{c.newCustomers}</td>
                    <td className="p-3 text-gray-700">{c.activeCustomers} users</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Popular Products Tab */}
        {activeTab === "Popular Products" && (
          <div className="mt-4 overflow-x-auto">
            <p className="text-sm text-gray-500 mb-4">Top performing inventory items ranked by sales volume.</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Units Sold</th>
                  <th className="p-3">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {popularProducts.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">{p.unitsSold} units</td>
                    <td className="p-3 font-semibold text-green-600">{p.totalRevenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Appointment Statistics Tab */}
        {activeTab === "Appointment Statistics" && (
          <div className="mt-4 overflow-x-auto">
            <p className="text-sm text-gray-500 mb-4">Overview of completed sessions versus cancellations.</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Service Type</th>
                  <th className="p-3">Completed Sessions</th>
                  <th className="p-3">Cancellations</th>
                </tr>
              </thead>
              <tbody>
                {appointmentStats.map((a) => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{a.service}</td>
                    <td className="p-3">
                      <span className="rounded bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                        {a.completed} completed
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="rounded bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                        {a.cancelled} cancelled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}