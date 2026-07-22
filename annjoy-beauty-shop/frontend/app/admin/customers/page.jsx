"use client";

import { useState } from "react";

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("View Customers");

  // Sample customer data including profile picture, contact details, points, etc.
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1 555-0192",
      loyaltyPoints: 340,
      totalPurchases: 12,
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+1 555-0183",
      loyaltyPoints: 120,
      totalPurchases: 5,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    {
      id: 3,
      name: "Charlie Davis",
      email: "charlie@example.com",
      phone: "+1 555-0174",
      loyaltyPoints: 550,
      totalPurchases: 19,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    },
  ]);

  // Sample purchase history data
  const [purchaseHistory, setPurchaseHistory] = useState([
    { id: 1, customer: "Alice Johnson", item: "Wireless Mouse", amount: 25.00, date: "2026-06-18" },
    { id: 2, customer: "Bob Smith", item: "USB-C Hub", amount: 30.00, date: "2026-06-20" },
    { id: 3, customer: "Charlie Davis", item: "HD Monitor", amount: 180.00, date: "2026-06-21" },
  ]);

  // Sample customer reviews data
  const [reviews, setReviews] = useState([
    { id: 1, customer: "Alice Johnson", rating: 5, comment: "Fantastic product quality and fast shipping!", date: "2026-06-19" },
    { id: 2, customer: "Bob Smith", rating: 4, comment: "Good experience overall, will shop again.", date: "2026-06-20" },
  ]);

  // Form states for adding or updating profiles/points
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || "");
  const [pointsAdjustment, setPointsAdjustment] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerAvatar, setNewCustomerAvatar] = useState("");

  const handleUpdatePoints = (e) => {
    e.preventDefault();
    const pointsChange = parseInt(pointsAdjustment, 10);
    if (isNaN(pointsChange)) return;

    setCustomers(
      customers.map((c) => {
        if (c.id === parseInt(selectedCustomerId, 10)) {
          return { ...c, loyaltyPoints: Math.max(0, c.loyaltyPoints + pointsChange) };
        }
        return c;
      })
    );

    setPointsAdjustment("");
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerEmail) return;

    const newCustomer = {
      id: Date.now(),
      name: newCustomerName,
      email: newCustomerEmail,
      phone: newCustomerPhone || "N/A",
      loyaltyPoints: 0,
      totalPurchases: 0,
      avatarUrl: newCustomerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    };

    setCustomers([...customers, newCustomer]);
    setNewCustomerName("");
    setNewCustomerEmail("");
    setNewCustomerPhone("");
    setNewCustomerAvatar("");
    setActiveTab("View Customers");
  };

  const buttons = [
    "View Customers",
    "Purchase History",
    "Loyalty Points",
    "Customer Reviews",
    "Customer Profiles",
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Customers</h1>
      <p className="mt-3 text-gray-600">
        Manage customer accounts, purchase history, loyalty programs, and profiles seamlessly.
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

        {/* View Customers Tab */}
        {activeTab === "View Customers" && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Avatar</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Contact Info</th>
                  <th className="p-3">Loyalty Points</th>
                  <th className="p-3">Total Orders</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={c.avatarUrl}
                        alt={c.name}
                        className="h-12 w-12 rounded-full object-cover border"
                      />
                    </td>
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3">
                      <div className="text-gray-900 font-medium">{c.email}</div>
                      <div className="text-xs text-gray-500">{c.phone}</div>
                    </td>
                    <td className="p-3">
                      <span className="rounded bg-blue-100 px-2.5 py-1 text-sm font-semibold text-blue-700">
                        {c.loyaltyPoints} pts
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{c.totalPurchases} orders</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Purchase History Tab */}
        {activeTab === "Purchase History" && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Item Purchased</th>
                  <th className="p-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-500">{p.date}</td>
                    <td className="p-3 font-medium">{p.customer}</td>
                    <td className="p-3">{p.item}</td>
                    <td className="p-3 font-semibold text-green-600">${p.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Loyalty Points Tab */}
        {activeTab === "Loyalty Points" && (
          <div className="mt-6 max-w-lg space-y-6">
            <p className="text-sm text-gray-500">Reward or deduct loyalty points for specific customers.</p>
            <form onSubmit={handleUpdatePoints} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.loyaltyPoints} pts)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Points Adjustment (+ to add, - to deduct)</label>
                <input
                  type="number"
                  value={pointsAdjustment}
                  onChange={(e) => setPointsAdjustment(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. 50 or -20"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium"
              >
                Update Points
              </button>
            </form>
          </div>
        )}

        {/* Customer Reviews Tab */}
        {activeTab === "Customer Reviews" && (
          <div className="mt-4 space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="rounded-lg border bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">{rev.customer}</h4>
                  <span className="text-xs text-gray-500">{rev.date}</span>
                </div>
                <div className="mt-1 text-yellow-500 font-bold">
                  {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                </div>
                <p className="mt-2 text-sm text-gray-600">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Customer Profiles Tab */}
        {activeTab === "Customer Profiles" && (
          <form onSubmit={handleAddCustomer} className="mt-6 max-w-2xl space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Add New Customer Profile</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={newCustomerEmail}
                  onChange={(e) => setNewCustomerEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. jane@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. +1 555-0199"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Avatar Image URL</label>
                <input
                  type="url"
                  value={newCustomerAvatar}
                  onChange={(e) => setNewCustomerAvatar(e.target.value)}
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 font-medium"
            >
              Save Customer Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
}