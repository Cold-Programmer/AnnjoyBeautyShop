export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2 text-4xl">Privacy policy</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-ink/70">
        <p>We collect only what's needed to run your bookings and orders: name, phone, email, and delivery address.</p>
        <h2 className="pt-4 text-lg text-ink">How we use your data</h2>
        <p>To confirm appointments, process M-Pesa payments, and send order/appointment updates.</p>
        <h2 className="pt-4 text-lg text-ink">Your rights</h2>
        <p>You can request a copy of your data or ask us to delete your account at any time from Settings.</p>
      </div>
    </div>
  );
}
