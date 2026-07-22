"use client";

import { useState } from "react";

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("View Staff");

  // Sample staff data with complete details
  const [staffList, setStaffList] = useState([
    {
      id: 1,
      name: "Sarah Jenkins",
      email: "sarah@example.com",
      role: "Inventory Manager",
      attendance: "Present",
      performance: "Exceeds Expectations",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    },
    {
      id: 2,
      name: "Michael Chang",
      email: "michael@example.com",
      role: "Sales Associate",
      attendance: "Present",
      performance: "Meets Expectations",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    },
    {
      id: 3,
      name: "Jessica Taylor",
      email: "jessica@example.com",
      role: "Support Lead",
      attendance: "Absent",
      performance: "Needs Improvement",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  ]);

  // Form states for adding staff
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Sales Associate");
  const [newAvatar, setNewAvatar] = useState("");

  // State for editing staff
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

  // Role permissions state
  const [permissions, setPermissions] = useState({
    "Inventory Manager": { inventory: true, orders: true, staff: false },
    "Sales Associate": { inventory: false, orders: true, staff: false },
    "Support Lead": { inventory: false, orders: true, staff: false },
  });
  const [selectedRole, setSelectedRole] = useState("Inventory Manager");
  const [newPermissionRole, setNewPermissionRole] = useState("");
  const [newPermissionInventory, setNewPermissionInventory] = useState(false);
  const [newPermissionOrders, setNewPermissionOrders] = useState(false);
  const [newPermissionStaff, setNewPermissionStaff] = useState(false);

  // CRUD: Create (Add Staff)
  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newStaffMember = {
      id: Date.now(),
      name: newName,
      email: newEmail,
      role: newRole,
      attendance: "Present",
      performance: "Meets Expectations",
      avatarUrl: newAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    };

    setStaffList([...staffList, newStaffMember]);
    setNewName("");
    setNewEmail("");
    setNewRole("Sales Associate");
    setNewAvatar("");
    setActiveTab("View Staff");
  };

  // CRUD: Update (Start Editing)
  const handleStartEdit = (staff) => {
    setEditingStaffId(staff.id);
    setEditName(staff.name);
    setEditEmail(staff.email);
    setEditRole(staff.role);
  };

  // CRUD: Update (Save Edit)
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setStaffList(
      staffList.map((staff) =>
        staff.id === editingStaffId
          ? { ...staff, name: editName, email: editEmail, role: editRole }
          : staff
      )
    );
    setEditingStaffId(null);
    setEditName("");
    setEditEmail("");
    setEditRole("");
  };

  // CRUD: Delete (Remove Staff)
  const handleDeleteStaff = (id) => {
    setStaffList(staffList.filter((staff) => staff.id !== id));
  };

  // Attendance Update Functionality
  const handleAttendanceChange = (id, status) => {
    setStaffList(
      staffList.map((staff) => (staff.id === id ? { ...staff, attendance: status } : staff))
    );
  };

  // Performance Update Functionality
  const handlePerformanceChange = (id, rating) => {
    setStaffList(
      staffList.map((staff) => (staff.id === id ? { ...staff, performance: rating } : staff))
    );
  };

  // Add / Update Roles & Permissions Functionality
  const handleAddRolePermission = (e) => {
    e.preventDefault();
    if (!newPermissionRole.trim()) return;

    setPermissions({
      ...permissions,
      [newPermissionRole]: {
        inventory: newPermissionInventory,
        orders: newPermissionOrders,
        staff: newPermissionStaff,
      },
    });
    setSelectedRole(newPermissionRole);
    setNewPermissionRole("");
    setNewPermissionInventory(false);
    setNewPermissionOrders(false);
    setNewPermissionStaff(false);
  };

  const buttons = [
    "View Staff",
    "Add Staff",
    "Edit Staff",
    "Roles & Permissions",
    "Attendance",
    "Performance",
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Staff</p>
      <h1 className="mt-2 text-3xl font-bold">Staff Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Manage staff accounts, roles, attendance, and performance tracking with full CRUD functionality.
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

        {/* View Staff Tab */}
        {activeTab === "View Staff" && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Avatar</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Attendance</th>
                  <th className="p-3">Performance</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={staff.avatarUrl}
                        alt={staff.name}
                        className="h-12 w-12 rounded-full object-cover border"
                      />
                    </td>
                    <td className="p-3 font-medium">{staff.name}</td>
                    <td className="p-3 text-gray-500">{staff.email}</td>
                    <td className="p-3">
                      <span className="rounded bg-gray-100 px-2 py-1 text-sm font-medium text-gray-800">
                        {staff.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded px-2.5 py-1 text-xs font-semibold ${
                          staff.attendance === "Present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {staff.attendance}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{staff.performance}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Staff Tab */}
        {activeTab === "Add Staff" && (
          <form onSubmit={handleAddStaff} className="mt-6 max-w-2xl space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                >
                  {Object.keys(permissions).map((roleOption) => (
                    <option key={roleOption} value={roleOption}>
                      {roleOption}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Avatar Image URL</label>
                <input
                  type="url"
                  value={newAvatar}
                  onChange={(e) => setNewAvatar(e.target.value)}
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 font-medium"
            >
              Save Staff Member
            </button>
          </form>
        )}

        {/* Edit Staff Tab */}
        {activeTab === "Edit Staff" && (
          <div className="mt-4 overflow-x-auto">
            <p className="text-sm text-gray-500 mb-4">Select a staff member to update their information or role.</p>
            {editingStaffId ? (
              <form onSubmit={handleSaveEdit} className="mb-6 max-w-xl space-y-4 rounded-lg border p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-800">Editing Staff Member</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md border bg-white p-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md border bg-white p-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="mt-1 w-full rounded-md border bg-white p-2 focus:border-blue-500 focus:outline-none"
                  >
                    {Object.keys(permissions).map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {roleOption}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingStaffId(null)}
                    className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{staff.name}</td>
                    <td className="p-3 text-gray-500">{staff.email}</td>
                    <td className="p-3 text-gray-600">{staff.role}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleStartEdit(staff)}
                        className="rounded bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-200"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Roles & Permissions Tab */}
        {activeTab === "Roles & Permissions" && (
          <div className="mt-4 space-y-8 max-w-xl">
            <div>
              <p className="text-sm text-gray-500 mb-2">Inspect access rights per role level.</p>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Role to Inspect</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
              >
                {Object.keys(permissions).map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            {permissions[selectedRole] && (
              <div className="rounded-lg border bg-gray-50 p-4 space-y-3">
                <h4 className="font-semibold text-gray-800">Permissions for {selectedRole}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span>Manage Inventory</span>
                  <span className={permissions[selectedRole].inventory ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {permissions[selectedRole].inventory ? "Allowed" : "Restricted"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Manage Orders</span>
                  <span className={permissions[selectedRole].orders ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {permissions[selectedRole].orders ? "Allowed" : "Restricted"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Manage Staff</span>
                  <span className={permissions[selectedRole].staff ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {permissions[selectedRole].staff ? "Allowed" : "Restricted"}
                  </span>
                </div>
              </div>
            )}

            {/* Form to add a new Role */}
            <form onSubmit={handleAddRolePermission} className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-gray-800">Add New Role & Define Permissions</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role Name</label>
                <input
                  type="text"
                  value={newPermissionRole}
                  onChange={(e) => setNewPermissionRole(e.target.value)}
                  placeholder="e.g. Store Supervisor"
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newPermissionInventory}
                    onChange={(e) => setNewPermissionInventory(e.target.checked)}
                  />
                  Allow Inventory Management
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newPermissionOrders}
                    onChange={(e) => setNewPermissionOrders(e.target.checked)}
                  />
                  Allow Order Management
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newPermissionStaff}
                    onChange={(e) => setNewPermissionStaff(e.target.checked)}
                  />
                  Allow Staff Management
                </label>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 font-medium"
              >
                Create Role
              </button>
            </form>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === "Attendance" && (
          <div className="mt-4 overflow-x-auto">
            <p className="text-sm text-gray-500 mb-4">Track and update daily attendance status for each staff member.</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Name</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{staff.name}</td>
                    <td className="p-3">
                      <span className={`rounded px-2 py-1 text-xs font-semibold ${staff.attendance === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {staff.attendance}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleAttendanceChange(staff.id, "Present")}
                        className={`rounded px-3 py-1 text-xs font-semibold ${staff.attendance === "Present" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(staff.id, "Absent")}
                        className={`rounded px-3 py-1 text-xs font-semibold ${staff.attendance === "Absent" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === "Performance" && (
          <div className="mt-4 overflow-x-auto">
            <p className="text-sm text-gray-500 mb-4">Evaluate and update staff performance reviews.</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Name</th>
                  <th className="p-3">Current Rating</th>
                  <th className="p-3">Update Rating</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{staff.name}</td>
                    <td className="p-3 text-sm text-gray-700">{staff.performance}</td>
                    <td className="p-3">
                      <select
                        value={staff.performance}
                        onChange={(e) => handlePerformanceChange(staff.id, e.target.value)}
                        className="rounded border p-1.5 text-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="Exceeds Expectations">Exceeds Expectations</option>
                        <option value="Meets Expectations">Meets Expectations</option>
                        <option value="Needs Improvement">Needs Improvement</option>
                      </select>
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