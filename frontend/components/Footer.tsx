import Link from "next/link";
import { businessInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-lg text-cream">GLOW 'N' GO</p>
          <p className="mt-3 text-sm leading-relaxed">
            Premium hair, nails, makeup and skin care in {businessInfo.location}.
          </p>
          <div className="mt-4 flex gap-3">
            {[
              { label: "Facebook", href: businessInfo.social.facebook },
              { label: "Instagram", href: businessInfo.social.instagram },
              { label: "TikTok", href: businessInfo.social.tiktok },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="rounded-full border border-cream/20 px-3 py-1.5 text-xs transition-colors hover:border-gold hover:text-gold">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow text-gold">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-gold">Services</Link></li>
            <li><Link href="/shop" className="hover:text-gold">Shop</Link></li>
            <li><Link href="/book-appointment" className="hover:text-gold">Book an appointment</Link></li>
            <li><Link href="/about" className="hover:text-gold">About us</Link></li>
            <li><Link href="/faq" className="hover:text-gold">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold">Business hours</p>
          <ul className="mt-4 space-y-2 text-sm">
            {businessInfo.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span className="text-cream/60">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{businessInfo.location}</li>
            <li>
              <a href={`tel:${businessInfo.phone.replace(/\s/g, "")}`} className="hover:text-gold">{businessInfo.phone}</a>
            </li>
            <li>
              <a href={`https://wa.me/${businessInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                WhatsApp us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-5 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} GLOW 'N' GO Beauty & Cosmetics. All rights reserved. ·{" "}
        <Link href="/privacy" className="hover:text-gold">Privacy</Link> ·{" "}
        <Link href="/terms" className="hover:text-gold">Terms</Link> ·{" "}
        <Link href="/faq" className="hover:text-gold">FAQ</Link>
      </div>
    </footer>
  );
}
