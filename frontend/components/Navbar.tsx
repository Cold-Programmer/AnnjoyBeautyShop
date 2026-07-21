"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";

const links = [
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/90 backdrop-blur shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-xl tracking-tight">
          Annjoy <span className="text-rosegold-dark">Beauty</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm font-medium text-ink/80 transition-colors hover:text-rosegold-dark">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative rounded-full border border-ink/10 p-2.5 transition-colors hover:border-rosegold" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.6 6H17M17 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM9 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rosegold-dark text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/book-appointment" className="btn-primary hidden md:inline-flex">
            Book Now
          </Link>
          <button
            className="rounded-full border border-ink/10 p-2.5 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-cream px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/book-appointment" onClick={() => setOpen(false)} className="btn-primary w-full">
                Book Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
