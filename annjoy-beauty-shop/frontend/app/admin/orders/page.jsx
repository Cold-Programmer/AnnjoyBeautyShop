"use client";

import { useState } from "react";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All Orders");

  // State for All Orders
  const [orders, setOrders] = useState([
    { id: "ORD-001", customer: "Alice Njeri", total: "KES 3,500", status: "Processing", payment: "Paid", delivery: "Dispatched" },
    { id: "ORD-002", customer: "Brian Omondi", total: "KES 7,200", status: "Completed", payment: "Paid", delivery: "Delivered" },
    { id: "ORD-003", customer: "Cynthia Mutua", total: "KES 1,500", status: "Pending", payment: "Unpaid", delivery: "Processing" },
  ]);

  // States for interactive updates
  const [selectedOrderId, setSelectedOrderId] = useState("ORD-001");
  const [newOrderStatus, setNewOrderStatus] = useState("Processing");
  const [newPaymentStatus, setNewPaymentStatus] = useState("Paid");
  const [newDeliveryStatus, setNewDeliveryStatus] = useState("Dispatched");

  // Feedback notification banner state
  const [feedback, setFeedback] = useState("");

  const triggerFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 4000);
  };

  const handleUpdateOrderStatus = (e) => {
    e.preventDefault();
    setOrders(orders.map(o => o.id === selectedOrderId ? { ...o, status: newOrderStatus } : o));
    triggerFeedback(`Order ${selectedOrderId} status updated to "${newOrderStatus}" successfully!`);
  };

  const handleUpdatePaymentStatus = (e) => {
    e.preventDefault();
    setOrders(orders.map(o => o.id === selectedOrderId ? { ...o, payment: newPaymentStatus } : o));
    triggerFeedback(`Order ${selectedOrderId} payment status updated to "${newPaymentStatus}" successfully!`);
  };

  const handleUpdateDelivery = (e) => {
    e.preventDefault();
    setOrders(orders.map(o => o.id === selectedOrderId ? { ...o, delivery: newDeliveryStatus } : o));
    triggerFeedback(`Order ${selectedOrderId} delivery tracking updated to "${newDeliveryStatus}" successfully!`);
  };

  const buttons = [
    "All Orders",
    "Order Status",
    "Payment Status",
    "Invoices",
    "Delivery Tracking",
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Orders</h1>

      <p className="mt-3 text-gray-600">
        Manage customer orders, update fulfillment workflows, review invoices, and track deliveries.
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

      {/* Success Notification Banner */}
      {feedback && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4 text-green-700 font-medium text-sm">
          {feedback}
        </div>
      )}

      {/* Dynamic Content Area */}
      <div className="mt-8 rounded-xl border bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">{activeTab}</h2>

        {/* All Orders Tab */}
        {activeTab === "All Orders" && (
          <div className="mt-6 overflow-x-auto">
            <p className="text-sm text-gray-500 mb-4">Complete master ledger of all customer transactions.</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Delivery</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-blue-600">{o.id}</td>
                    <td className="p-3">{o.customer}</td>
                    <td className="p-3 font-semibold">{o.total}</td>
                    <td className="p-3">
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`rounded px-2 py-1 text-xs font-semibold ${o.payment === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {o.payment}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{o.delivery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Status Tab */}
        {activeTab === "Order Status" && (
          <form onSubmit={handleUpdateOrderStatus} className="mt-6 max-w-xl space-y-4">
            <p className="text-sm text-gray-500">Modify fulfillment state for specific customer orders.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Order ID</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>{o.id} - {o.customer}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Order Status</label>
              <select
                value={newOrderStatus}
                onChange={(e) => setNewOrderStatus(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
            >
              Update Order Status
            </button>
          </form>
        )}

        {/* Payment Status Tab */}
        {activeTab === "Payment Status" && (
          <form onSubmit={handleUpdatePaymentStatus} className="mt-6 max-w-xl space-y-4">
            <p className="text-sm text-gray-500">Verify and toggle financial transaction settlement states.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Order ID</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>{o.id} - {o.customer} ({o.payment})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Status</label>
              <select
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
            >
              Update Payment Status
            </button>
          </form>
        )}

        {/* Invoices Tab */}
        {activeTab === "Invoices" && (
          <div className="mt-6 overflow-x-auto">
            <p className="text-sm text-gray-500 mb-4">Generate and download official customer purchase invoices.</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-blue-600">{o.id}</td>
                    <td className="p-3">{o.customer}</td>
                    <td className="p-3 font-semibold">{o.total}</td>
                    <td className="p-3">
                      <button
                        onClick={() => triggerFeedback(`Downloading PDF invoice for ${o.id}...`)}
                        className="rounded bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        📥 Download Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delivery Tracking Tab */}
        {activeTab === "Delivery Tracking" && (
          <form onSubmit={handleUpdateDelivery} className="mt-6 max-w-xl space-y-4">
            <p className="text-sm text-gray-500">Update parcel shipping stages and courier dispatch trackers.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Order ID</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>{o.id} - {o.customer}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Status</label>
              <select
                value={newDeliveryStatus}
                onChange={(e) => setNewDeliveryStatus(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="Processing">Processing</option>
                <option value="Dispatched">Dispatched</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
            >
              Update Delivery Tracking
            </button>
          </form>
        )}
      </div>
    </div>
  );
}