"use client";

import { useState } from "react";

const faqs = [
  { q: "Do I need to book in advance?", a: "Walk-ins are welcome, but booking online guarantees your time slot — especially on weekends." },
  { q: "What payment methods do you accept?", a: "M-Pesa for both services and online shop orders, plus cash in-store." },
  { q: "Can I cancel or reschedule an appointment?", a: "Yes — go to your dashboard and cancel or request a new time up to 2 hours before your slot." },
  { q: "Do you deliver shop orders?", a: "Yes, within Tharaka Nithi County. You can also choose in-store pickup at checkout." },
  { q: "Is there a loyalty program?", a: "Yes — earn points on every appointment and order, redeemable for discounts." },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="eyebrow">Help center</p>
      <h1 className="mt-2 text-4xl">Frequently asked questions</h1>

      <div className="mt-10 divide-y divide-ink/10 rounded-xl2 border border-ink/10 bg-white">
        {faqs.map((f, i) => (
          <div key={f.q}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-6 py-5 text-left"
              aria-expanded={open === i}
            >
              <span className="font-medium">{f.q}</span>
              <span className="text-xl text-rosegold-dark">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <p className="px-6 pb-5 text-sm text-ink/60">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
