"use client";

import { useState } from "react";

export default function StylistsPage() {
  const [activeTab, setActiveTab] = useState("View Stylists");

  // Sample stylists data with complete details
  const [stylists, setStylists] = useState([
    {
      id: 1,
      name: "Chloe Bennett",
      email: "chloe@salon.com",
      phone: "+1 555-0111",
      services: ["Haircut", "Styling", "Coloring"],
      availability: "Available",
      schedule: "Mon - Fri (9:00 AM - 5:00 PM)",
      rating: 4.8,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
    {
      id: 2,
      name: "Marcus Vance",
      email: "marcus@salon.com",
      phone: "+1 555-0122",
      services: ["Haircut", "Beard Trim"],
      availability: "Off Duty",
      schedule: "Tue - Sat (10:00 AM - 6:00 PM)",
      rating: 4.6,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    {
      id: 3,
      name: "Sophia Loren",
      email: "sophia@salon.com",
      phone: "+1 555-0133",
      services: ["Bridal Makeup", "Styling"],
      availability: "Available",
      schedule: "Wed - Sun (8:00 AM - 4:00 PM)",
      rating: 4.9,
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    },
  ]);

  // Sample reviews data for stylists
  const [reviews, setReviews] = useState([
    { id: 1, stylist: "Chloe Bennett", client: "Emily Davis", rating: 5, comment: "Chloe gave me the best haircut of my life!", date: "2026-07-20" },
    { id: 2, stylist: "Marcus Vance", client: "James Wilson", rating: 4, comment: "Great beard trim, very professional.", date: "2026-07-21" },
  ]);

  // Form state for adding a new stylist profile
  const [newStylistName, setNewStylistName] = useState("");
  const [newStylistEmail, setNewStylistEmail] = useState("");
  const [newStylistPhone, setNewStylistPhone] = useState("");
  const [newStylistAvatar, setNewStylistAvatar] = useState("");

  // State for Assign Services assignment
  const [selectedStylistId, setSelectedStylistId] = useState(stylists[0]?.id || "");
  const [newServiceInput, setNewServiceInput] = useState("");

  // State for Schedule/Availability updates
  const [selectedScheduleId, setSelectedScheduleId] = useState(stylists[0]?.id || "");
  const [newScheduleInput, setNewScheduleInput] = useState("");

  const handleAddStylist = (e) => {
    e.preventDefault();
    if (!newStylistName || !newStylistEmail) return;

    const newStylist = {
      id: Date.now(),
      name: newStylistName,
      email: newStylistEmail,
      phone: newStylistPhone || "N/A",
      services: ["General Haircut"],
      availability: "Available",
      schedule: "Mon - Fri (9:00 AM - 5:00 PM)",
      rating: 5.0,
      avatarUrl: newStylistAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    };

    setStylists([...stylists, newStylist]);
    setNewStylistName("");
    setNewStylistEmail("");
    setNewStylistPhone("");
    setNewStylistAvatar("");
    setActiveTab("View Stylists");
  };

  const handleAssignService = (e) => {
    e.preventDefault();
    if (!newServiceInput.trim()) return;

    setStylists(
      stylists.map((s) => {
        if (s.id === parseInt(selectedStylistId, 10)) {
          return { ...s, services: [...s.services, newServiceInput.trim()] };
        }
        return s;
      })
    );
    setNewServiceInput("");
  };

  const handleToggleAvailability = (id) => {
    setStylists(
      stylists.map((s) => {
        if (s.id === id) {
          const nextStatus = s.availability === "Available" ? "Off Duty" : "Available";
          return { ...s, availability: nextStatus };
        }
        return s;
      })
    );
  };

  const handleUpdateSchedule = (e) => {
    e.preventDefault();
    if (!newScheduleInput.trim()) return;

    setStylists(
      stylists.map((s) => {
        if (s.id === parseInt(selectedScheduleId, 10)) {
          return { ...s, schedule: newScheduleInput.trim() };
        }
        return s;
      })
    );
    setNewScheduleInput("");
  };

  const buttons = [
    "View Stylists",
    "Assign Services",
    "Manage Availability",
    "Ratings & Reviews",
    "Schedules",
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Stylists</h1>
      <p className="mt-3 text-gray-600">
        Manage salon stylists, assign services, track availability, schedules, and reviews seamlessly.
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

        {/* View Stylists Tab */}
        {activeTab === "View Stylists" && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Avatar</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Services</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {stylists.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={s.avatarUrl}
                        alt={s.name}
                        className="h-12 w-12 rounded-full object-cover border"
                      />
                    </td>
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3">
                      <div className="text-gray-900 font-medium">{s.email}</div>
                      <div className="text-xs text-gray-500">{s.phone}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {s.services.map((srv, idx) => (
                          <span key={idx} className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                            {srv}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`rounded px-2.5 py-1 text-xs font-semibold ${s.availability === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {s.availability}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-yellow-600">★ {s.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Assign Services Tab */}
        {activeTab === "Assign Services" && (
          <div className="mt-6 max-w-lg space-y-6">
            <p className="text-sm text-gray-500">Add a new specialty service capability to a stylist profile.</p>
            <form onSubmit={handleAssignService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Stylist</label>
                <select
                  value={selectedStylistId}
                  onChange={(e) => setSelectedStylistId(e.target.value)}
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                >
                  {stylists.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.services.join(", ")})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Service Name</label>
                <input
                  type="text"
                  value={newServiceInput}
                  onChange={(e) => setNewServiceInput(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Hair Coloring"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium"
              >
                Assign Service
              </button>
            </form>
          </div>
        )}

        {/* Manage Availability Tab */}
        {activeTab === "Manage Availability" && (
          <div className="mt-4 overflow-x-auto">
            <p className="text-sm text-gray-500 mb-4">Toggle working status between Available and Off Duty instantly.</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Name</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {stylists.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3">
                      <span className={`rounded px-2.5 py-1 text-xs font-semibold ${s.availability === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {s.availability}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleAvailability(s.id)}
                        className="rounded bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-200"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Ratings & Reviews Tab */}
        {activeTab === "Ratings & Reviews" && (
          <div className="mt-4 space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="rounded-lg border bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">{rev.stylist}</h4>
                    <p className="text-xs text-gray-500">Client: {rev.client}</p>
                  </div>
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

        {/* Schedules Tab */}
        {activeTab === "Schedules" && (
          <div className="mt-6 max-w-xl space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-2">Update weekly operating shift hours for any stylist.</p>
              <form onSubmit={handleUpdateSchedule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Stylist</label>
                  <select
                    value={selectedScheduleId}
                    onChange={(e) => setSelectedScheduleId(e.target.value)}
                    className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                  >
                    {stylists.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (Current: {s.schedule})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Schedule Hours</label>
                  <input
                    type="text"
                    value={newScheduleInput}
                    onChange={(e) => setNewScheduleInput(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Wed - Sun (9:00 AM - 5:00 PM)"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
                >
                  Update Schedule
                </button>
              </form>
            </div>

            {/* Quick Listing of All Schedules */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-800 mb-3">All Stylist Schedules</h3>
              <div className="space-y-2">
                {stylists.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded border bg-gray-50 p-3 text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-gray-600">{s.schedule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}