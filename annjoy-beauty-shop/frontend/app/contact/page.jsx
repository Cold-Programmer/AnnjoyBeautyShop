"use client";
import { useState } from "react";
import { businessInfo } from "@/lib/data";
export default function ContactPage() {
    const [sent, setSent] = useState(false);
    return (<div className="mx-auto max-w-5xl px-5 py-16">
      <p className="eyebrow">Get in touch</p>
      <h1 className="mt-2 text-4xl">Contact us</h1>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div className="card p-5">
            <p className="text-sm text-ink/50">Location</p>
            <p className="mt-1 font-medium">{businessInfo.location}</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-ink/50">Phone</p>
            <a href={`tel:${businessInfo.phone.replace(/\s/g, "")}`} className="mt-1 block font-medium hover:text-rosegold-dark">
              {businessInfo.phone}
            </a>
          </div>
          <div className="card p-5">
            <p className="text-sm text-ink/50">WhatsApp</p>
            <a href={`https://wa.me/${businessInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-1 block font-medium hover:text-rosegold-dark">
              Chat with us directly
            </a>
          </div>
          <div className="card overflow-hidden">
            <iframe title="GLOW 'N' GO Beauty & Cosmetics location" className="h-56 w-full" loading="lazy" src="https://www.google.com/maps?q=Ndagani,Tharaka+Nithi+County,Kenya&output=embed"/>
          </div>
        </div>

        {sent ? (<div className="card flex items-center justify-center p-10 text-center">
            <div>
              <p className="text-2xl">Message sent ✓</p>
              <p className="mt-2 text-ink/60">We'll reply within one business day.</p>
            </div>
          </div>) : (<form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
            <div>
              <label htmlFor="cname" className="text-sm font-medium">Name</label>
              <input id="cname" required className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
            </div>
            <div>
              <label htmlFor="cemail" className="text-sm font-medium">Email</label>
              <input id="cemail" type="email" required className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
            </div>
            <div>
              <label htmlFor="cmessage" className="text-sm font-medium">Message</label>
              <textarea id="cmessage" rows={5} required className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"/>
            </div>
            <button type="submit" className="btn-primary w-full">Send message</button>
          </form>)}
      </div>
    </div>);
}
