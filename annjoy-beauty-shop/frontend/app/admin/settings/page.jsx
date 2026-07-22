"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Business Information");

  // State for Business Information
  const [businessInfo, setBusinessInfo] = useState({
    name: "Lush Beauty Lounge",
    phone: "+254 712 345 678",
    email: "support@lushbeauty.com",
    address: "123 Moi Avenue, Nairobi",
  });

  // State for Profile Settings
  const [profile, setProfile] = useState({
    adminName: "Admin User",
    adminEmail: "admin@lushbeauty.com",
    role: "Super Administrator",
  });

  // State for Password Change
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");

  // State for M-Pesa Configuration
  const [mpesaConfig, setMpesaConfig] = useState({
    shortcode: "174379",
    passkey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
    environment: "Sandbox",
  });

  // State for SMTP & Email Settings
  const [smtpConfig, setSmtpConfig] = useState({
    host: "smtp.mailtrap.io",
    port: "2525",
    user: "user_sample",
    pass: "********",
  });

  // State for Social Media Links
  const [socials, setSocials] = useState({
    instagram: "https://instagram.com/lushbeauty",
    facebook: "https://facebook.com/lushbeautylounge",
    twitter: "https://twitter.com/lushbeauty",
  });

  // State for Dark / Light Mode with automatic system preference detection
  const [themeMode, setThemeMode] = useState("System Default");

  useEffect(() => {
    // Check initial system preference or stored setting
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (themeMode === "Dark Mode" || (themeMode === "System Default" && systemPrefersDark)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [themeMode]);

  // State for Roles & Permissions
  const [roles, setRoles] = useState([
    { id: 1, role: "Super Admin", access: "Full System Access" },
    { id: 2, role: "Manager", access: "Reports, Inventory, Appointments" },
    { id: 3, role: "Stylist", access: "View Schedule, Assign Services" },
  ]);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleAccess, setNewRoleAccess] = useState("");

  // General Notification banner state
  const [feedback, setFeedback] = useState("");

  const triggerFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 4000);
  };

  const handleSaveBusiness = (e) => {
    e.preventDefault();
    triggerFeedback("Business information updated successfully!");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    triggerFeedback("Admin profile updated successfully!");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirmPass) {
      setPasswordMessage("New passwords do not match!");
      return;
    }
    setPasswordMessage("");
    setPasswords({ current: "", newPass: "", confirmPass: "" });
    triggerFeedback("Password changed successfully!");
  };

  const handleSaveMpesa = (e) => {
    e.preventDefault();
    triggerFeedback("M-Pesa payment configurations updated successfully!");
  };

  const handleSaveSmtp = (e) => {
    e.preventDefault();
    triggerFeedback("SMTP & Email settings updated successfully!");
  };

  const handleSaveSocials = (e) => {
    e.preventDefault();
    triggerFeedback("Social media links updated successfully!");
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (!newRoleName.trim() || !newRoleAccess.trim()) return;

    setRoles([...roles, { id: Date.now(), role: newRoleName, access: newRoleAccess }]);
    setNewRoleName("");
    setNewRoleAccess("");
    triggerFeedback("New role configuration added successfully!");
  };

  const buttons = [
    "Business Information",
    "Profile Settings",
    "Change Password",
    "M-Pesa Configuration",
    "SMTP & Email Settings",
    "Social Media Links",
    "Dark / Light Mode",
    "Roles & Permissions",
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 transition-colors duration-200 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold dark:text-white">Settings</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Configure your beauty shop preferences, payment gateways, permissions, and system settings.
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
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {btn}
          </button>
        ))}
      </div>

      {/* Success Notification Banner */}
      {feedback && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4 text-green-700 font-medium text-sm dark:bg-green-900/30 dark:border-green-800 dark:text-green-300">
          {feedback}
        </div>
      )}

      {/* Dynamic Content Area */}
      <div className="mt-8 rounded-xl border bg-white p-6 shadow dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-semibold dark:text-white">{activeTab}</h2>

        {/* Business Information Tab */}
        {activeTab === "Business Information" && (
          <form onSubmit={handleSaveBusiness} className="mt-6 max-w-xl space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your beauty shop's public storefront details.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Name</label>
              <input
                type="text"
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                required
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input
                  type="text"
                  value={businessInfo.phone}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Email</label>
                <input
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Physical Address</label>
              <input
                type="text"
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                required
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
            >
              Save Information
            </button>
          </form>
        )}

        {/* Profile Settings Tab */}
        {activeTab === "Profile Settings" && (
          <form onSubmit={handleSaveProfile} className="mt-6 max-w-xl space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your administrator account credentials.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Full Name</label>
              <input
                type="text"
                value={profile.adminName}
                onChange={(e) => setProfile({ ...profile, adminName: e.target.value })}
                required
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Email Address</label>
              <input
                type="email"
                value={profile.adminEmail}
                onChange={(e) => setProfile({ ...profile, adminEmail: e.target.value })}
                required
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Role</label>
              <input
                type="text"
                disabled
                value={profile.role}
                className="mt-1 w-full rounded-md border bg-gray-50 p-2 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
            >
              Update Profile
            </button>
          </form>
        )}

        {/* Change Password Tab */}
        {activeTab === "Change Password" && (
          <form onSubmit={handleChangePassword} className="mt-6 max-w-xl space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Ensure your account is secure by using a strong password.</p>
            {passwordMessage && <p className="text-xs text-red-600 font-semibold">{passwordMessage}</p>}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                required
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
              <input
                type="password"
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                required
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmPass}
                onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                required
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
            >
              Change Password
            </button>
          </form>
        )}

        {/* M-Pesa Configuration Tab */}
        {activeTab === "M-Pesa Configuration" && (
          <form onSubmit={handleSaveMpesa} className="mt-6 max-w-xl space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure Daraja API credentials for automated mobile money checkout.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Shortcode / Paybill</label>
              <input
                type="text"
                value={mpesaConfig.shortcode}
                onChange={(e) => setMpesaConfig({ ...mpesaConfig, shortcode: e.target.value })}
                required
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Consumer Passkey</label>
              <input
                type="text"
                value={mpesaConfig.passkey}
                onChange={(e) => setMpesaConfig({ ...mpesaConfig, passkey: e.target.value })}
                required
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none font-mono text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Environment Mode</label>
              <select
                value={mpesaConfig.environment}
                onChange={(e) => setMpesaConfig({ ...mpesaConfig, environment: e.target.value })}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="Sandbox">Sandbox (Testing)</option>
                <option value="Production">Production (Live)</option>
              </select>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
            >
              Save M-Pesa Config
            </button>
          </form>
        )}

        {/* SMTP & Email Settings Tab */}
        {activeTab === "SMTP & Email Settings" && (
          <form onSubmit={handleSaveSmtp} className="mt-6 max-w-xl space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure mail server credentials for booking confirmations and alerts.</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Host</label>
                <input
                  type="text"
                  value={smtpConfig.host}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Port</label>
                <input
                  type="text"
                  value={smtpConfig.port}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Username</label>
              <input
                type="text"
                value={smtpConfig.user}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                required
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Password</label>
              <input
                type="password"
                value={smtpConfig.pass}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, pass: e.target.value })}
                required
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
            >
              Save SMTP Settings
            </button>
          </form>
        )}

        {/* Social Media Links Tab */}
        {activeTab === "Social Media Links" && (
          <form onSubmit={handleSaveSocials} className="mt-6 max-w-xl space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Connect your public social profiles for customer outreach.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instagram Handle URL</label>
              <input
                type="url"
                value={socials.instagram}
                onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Facebook Page URL</label>
              <input
                type="url"
                value={socials.facebook}
                onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Twitter / X Profile URL</label>
              <input
                type="url"
                value={socials.twitter}
                onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
            >
              Save Social Links
            </button>
          </form>
        )}

        {/* Dark / Light Mode Tab */}
        {activeTab === "Dark / Light Mode" && (
          <div className="mt-6 max-w-xl space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Choose between manual appearance toggles or match your automatic operating system settings.</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setThemeMode("Light Mode");
                  triggerFeedback("Switched to Light Mode interface.");
                }}
                className={`rounded-lg px-5 py-3 font-semibold border transition ${
                  themeMode === "Light Mode"
                    ? "bg-gray-900 text-white shadow-md dark:bg-white dark:text-gray-900"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                }`}
              >
                ☀️ Light Mode
              </button>
              <button
                onClick={() => {
                  setThemeMode("Dark Mode");
                  triggerFeedback("Switched to Dark Mode interface.");
                }}
                className={`rounded-lg px-5 py-3 font-semibold border transition ${
                  themeMode === "Dark Mode"
                    ? "bg-gray-900 text-white shadow-md dark:bg-white dark:text-gray-900"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                }`}
              >
                🌙 Dark Mode
              </button>
              <button
                onClick={() => {
                  setThemeMode("System Default");
                  triggerFeedback("Synced with Automatic System Theme Preference.");
                }}
                className={`rounded-lg px-5 py-3 font-semibold border transition ${
                  themeMode === "System Default"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                }`}
              >
                💻 System Default (Auto)
              </button>
            </div>
          </div>
        )}

        {/* Roles & Permissions Tab */}
        {activeTab === "Roles & Permissions" && (
          <div className="mt-6 max-w-xl space-y-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                    <th className="p-3">Role Title</th>
                    <th className="p-3">Permissions Scope</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50">
                      <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{r.role}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{r.access}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Form to add custom role */}
            <form onSubmit={handleAddRole} className="border-t pt-6 space-y-4 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Add New Role & Permissions</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role Title</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. Front Desk Receptionist"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Access Scope Description</label>
                <input
                  type="text"
                  value={newRoleAccess}
                  onChange={(e) => setNewRoleAccess(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. Can book appointments and check-in clients"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
              >
                Add Role
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}