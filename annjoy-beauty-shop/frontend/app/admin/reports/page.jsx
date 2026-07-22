"use client";

import { useState } from "react";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("Sales Reports");

  // Sample data for Sales Reports
  const [salesReports, setSalesReports] = useState([
    { id: 1, reportName: "Q2 2026 Sales Summary", generatedDate: "2026-06-30", totalRevenue: "$45,200.00", status: "Completed" },
    { id: 2, reportName: "June 2026 Monthly Sales", generatedDate: "2026-07-01", totalRevenue: "$19,850.00", status: "Completed" },
  ]);

  // Sample data for Inventory Reports
  const [inventoryReports, setInventoryReports] = useState([
    { id: 1, reportName: "Peripherals Stock Audit", generatedDate: "2026-07-05", totalItems: 68, status: "Optimal" },
    { id: 2, reportName: "Low Stock Warning Log", generatedDate: "2026-07-15", totalItems: 4, status: "Requires Restock" },
  ]);

  // Sample data for Customer Reports
  const [customerReports, setCustomerReports] = useState([
    { id: 1, reportName: "Active Loyalty Program Members", generatedDate: "2026-07-10", totalUsers: 580, avgPoints: "240 pts" },
    { id: 2, reportName: "New Customer Acquisition", generatedDate: "2026-07-20", totalUsers: 145, avgPoints: "45 pts" },
  ]);

  // Sample data for Appointment Reports
  const [appointmentReports, setAppointmentReports] = useState([
    { id: 1, reportName: "Stylist Utilization Report", generatedDate: "2026-07-18", completedSessions: 395, cancellationRate: "3.2%" },
  ]);

  // Form states for generating custom reports
  const [customReportName, setCustomReportName] = useState("");
  const [customReportType, setCustomReportType] = useState("Sales Reports");

  // Export state feedback
  const [exportMessage, setExportMessage] = useState("");

  const handleGenerateReport = (e) => {
    e.preventDefault();
    if (!customReportName.trim()) return;

    const newReport = {
      id: Date.now(),
      reportName: customReportName,
      generatedDate: new Date().toISOString().split("T")[0],
      totalRevenue: "$12,400.00",
      status: "Generated",
    };

    if (customReportType === "Sales Reports") {
      setSalesReports([...salesReports, newReport]);
    } else if (customReportType === "Inventory Reports") {
      setInventoryReports([...inventoryReports, { ...newReport, totalItems: 50 }]);
    } else if (customReportType === "Customer Reports") {
      setCustomerReports([...customerReports, { ...newReport, totalUsers: 120, avgPoints: "100 pts" }]);
    } else if (customReportType === "Appointment Reports") {
      setAppointmentReports([...appointmentReports, { ...newReport, completedSessions: 110, cancellationRate: "1.5%" }]);
    }

    setCustomReportName("");
    setActiveTab(customReportType);
  };

  const handleExport = (format) => {
    setExportMessage(`Successfully exported current ${activeTab} data as ${format}!`);
    setTimeout(() => setExportMessage(""), 4000);
  };

  const buttons = [
    "Sales Reports",
    "Inventory Reports",
    "Customer Reports",
    "Appointment Reports",
    "Export PDF & Excel",
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Reports</h1>
      <p className="mt-3 text-gray-600">
        Generate, view, and export business reports across sales, inventory, customers, and appointments seamlessly.
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
      {exportMessage && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4 text-green-700 font-medium text-sm">
          {exportMessage}
        </div>
      )}

      {/* Dynamic Content Area */}
      <div className="mt-8 rounded-xl border bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">{activeTab}</h2>

        {/* Sales Reports Tab */}
        {activeTab === "Sales Reports" && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Report Name</th>
                  <th className="p-3">Generated Date</th>
                  <th className="p-3">Total Revenue</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {salesReports.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{r.reportName}</td>
                    <td className="p-3 text-gray-500">{r.generatedDate}</td>
                    <td className="p-3 font-semibold text-green-600">{r.totalRevenue}</td>
                    <td className="p-3">
                      <span className="rounded bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Inventory Reports Tab */}
        {activeTab === "Inventory Reports" && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Report Name</th>
                  <th className="p-3">Generated Date</th>
                  <th className="p-3">Total Items Count</th>
                  <th className="p-3">Audit Status</th>
                </tr>
              </thead>
              <tbody>
                {inventoryReports.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{r.reportName}</td>
                    <td className="p-3 text-gray-500">{r.generatedDate}</td>
                    <td className="p-3">{r.totalItems} items</td>
                    <td className="p-3">
                      <span className={`rounded px-2.5 py-1 text-xs font-semibold ${r.status === "Optimal" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Customer Reports Tab */}
        {activeTab === "Customer Reports" && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Report Name</th>
                  <th className="p-3">Generated Date</th>
                  <th className="p-3">Total Users</th>
                  <th className="p-3">Average Points / Activity</th>
                </tr>
              </thead>
              <tbody>
                {customerReports.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{r.reportName}</td>
                    <td className="p-3 text-gray-500">{r.generatedDate}</td>
                    <td className="p-3">{r.totalUsers} users</td>
                    <td className="p-3 font-semibold text-blue-600">{r.avgPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Appointment Reports Tab */}
        {activeTab === "Appointment Reports" && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Report Name</th>
                  <th className="p-3">Generated Date</th>
                  <th className="p-3">Completed Sessions</th>
                  <th className="p-3">Cancellation Rate</th>
                </tr>
              </thead>
              <tbody>
                {appointmentReports.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{r.reportName}</td>
                    <td className="p-3 text-gray-500">{r.generatedDate}</td>
                    <td className="p-3 text-green-600 font-semibold">{r.completedSessions} sessions</td>
                    <td className="p-3 text-red-600 font-semibold">{r.cancellationRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Export PDF & Excel Tab */}
        {activeTab === "Export PDF & Excel" && (
          <div className="mt-6 max-w-xl space-y-6">
            <p className="text-sm text-gray-500">Download formatted data sheets for offline audits and presentations.</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleExport("PDF Format")}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-white hover:bg-red-700 font-medium text-sm flex items-center gap-2 shadow"
              >
                📄 Export as PDF
              </button>
              <button
                onClick={() => handleExport("Excel Spreadsheet")}
                className="rounded-lg bg-green-600 px-5 py-2.5 text-white hover:bg-green-700 font-medium text-sm flex items-center gap-2 shadow"
              >
                📊 Export as Excel (.xlsx)
              </button>
            </div>
          </div>
        )}

        {/* Generator Form for Custom Reports */}
        {activeTab !== "Export PDF & Excel" && (
          <form onSubmit={handleGenerateReport} className="mt-8 border-t pt-6 max-w-xl space-y-4">
            <h3 className="font-semibold text-gray-800">Generate New Custom Report</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Report Title</label>
                <input
                  type="text"
                  value={customReportName}
                  onChange={(e) => setCustomReportName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Weekly Custom Audit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Category</label>
                <select
                  value={customReportType}
                  onChange={(e) => setCustomReportType(e.target.value)}
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Sales Reports">Sales Reports</option>
                  <option value="Inventory Reports">Inventory Reports</option>
                  <option value="Customer Reports">Customer Reports</option>
                  <option value="Appointment Reports">Appointment Reports</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
            >
              Generate Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
}