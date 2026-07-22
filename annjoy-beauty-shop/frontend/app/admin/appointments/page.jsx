export default function AppointmentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Appointments</h1>

      <p className="mt-3 text-gray-600">
        Manage beauty appointments.
      </p>

      <div className="mt-8 rounded-xl border bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">Appointments Management</h2>

        <ul className="mt-4 list-disc pl-6">
          <li>View Appointments</li>
          <li>Assign Stylist</li>
          <li>Confirm Booking</li>
          <li>Cancel Booking</li>
          <li>Appointment Calendar</li>
        </ul>
      </div>
    </div>
  );
}