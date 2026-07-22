export default function StaffPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Staff</h1>

      <p className="mt-3 text-gray-600">
        Manage staff members.
      </p>

      <div className="mt-8 rounded-xl border bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">Staff Management</h2>

        <ul className="mt-4 list-disc pl-6">
          <li>Add Staff</li>
          <li>Edit Staff</li>
          <li>Roles & Permissions</li>
          <li>Attendance</li>
          <li>Performance</li>
        </ul>
      </div>
    </div>
  );
}