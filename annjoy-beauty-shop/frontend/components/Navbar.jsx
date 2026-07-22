"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useAuth, dashboardPathFor } from "@/lib/auth-context";
import ThemeToggle from "@/components/ThemeToggle";
const links = [
    { href: "/services", label: "Services" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];
export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { itemCount } = useCart();
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const menuRef = useRef(null);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    useEffect(() => {
        function onClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setMenuOpen(false);
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);
    return (<header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-cream/90 backdrop-blur shadow-sm dark:bg-[#141010]/90" : "bg-transparent"}`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative block h-10 w-10 overflow-hidden rounded-full border border-gold/40 shadow-sm">
            <Image src="/shop-signboard.png" alt="GLOW 'N' GO logo" fill className="object-cover"/>
          </span>
          <span className="font-display text-lg tracking-tight">
            GLOW <span className="text-rosegold-dark">'N'</span> GO
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (<li key={l.href} className="relative">
                <Link href={l.href} className={`text-sm font-medium transition-colors ${active ? "text-rosegold-dark" : "text-ink/80 hover:text-rosegold-dark dark:text-cream/80"}`}>
                  {l.label}
                </Link>
                {/* Animated underline — grows in on the active link */}
                <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-rosegold-dark transition-all duration-300 ${active ? "w-full" : "w-0"}`}/>
              </li>);
        })}
        </ul>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <Link href="/cart" className="relative rounded-full border border-ink/10 p-2.5 transition-all duration-200 hover:border-rosegold hover:scale-105 dark:border-cream/15" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.6 6H17M17 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM9 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {itemCount > 0 && (<span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 animate-[popIn_0.25s_ease-out] items-center justify-center rounded-full bg-rosegold-dark text-[10px] font-semibold text-white">
                {itemCount}
              </span>)}
          </Link>

          <Link href="/book-appointment" className="btn-primary hidden md:inline-flex">
            Book Now
          </Link>

          {/* User menu — this was entirely missing before, which is why
            there was no way back to a dashboard or to log out. */}
          {user ? (<div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-2 rounded-full border border-ink/10 py-1 pl-1 pr-3 transition-colors hover:border-rosegold dark:border-cream/15">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rosegold-dark/15 text-xs font-semibold text-rosegold-dark">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
                <span className="hidden text-xs font-medium sm:block">{user.firstName}</span>
              </button>

              {menuOpen && (<div className="absolute right-0 mt-2 w-56 origin-top-right animate-[popIn_0.15s_ease-out] rounded-xl2 border border-ink/10 bg-white p-2 shadow-soft dark:border-cream/10 dark:bg-[#1c1717]">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-ink/50">{user.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-rosegold-dark/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rosegold-dark">
                      {user.role}
                    </span>
                  </div>
                  <div className="my-1 border-t border-ink/10 dark:border-cream/10"/>
                  <Link href={dashboardPathFor(user.role)} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-ink/5 dark:hover:bg-cream/5">
                    Dashboard
                  </Link>
                  <Link href="/settings" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-ink/5 dark:hover:bg-cream/5">
                    Settings
                  </Link>
                  <div className="my-1 border-t border-ink/10 dark:border-cream/10"/>
                  <button onClick={logout} className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                    Log out
                  </button>
                </div>)}
            </div>) : (<Link href="/login" className="hidden text-sm font-medium sm:inline-block">Log in</Link>)}

          <button className="rounded-full border border-ink/10 p-2.5 md:hidden dark:border-cream/15" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      {open && (<div className="border-t border-ink/10 bg-cream px-5 py-4 md:hidden dark:border-cream/10 dark:bg-[#141010]">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (<li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium">
                  {l.label}
                </Link>
              </li>))}
            {user && (<li>
                <Link href={dashboardPathFor(user.role)} onClick={() => setOpen(false)} className="text-sm font-medium">
                  Dashboard
                </Link>
              </li>)}
            <li className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggle />
            </li>
            <li>
              <Link href="/book-appointment" onClick={() => setOpen(false)} className="btn-primary w-full">
                Book Now
              </Link>
            </li>
            {user && (<li>
                <button onClick={logout} className="text-sm font-medium text-red-600">Log out</button>
              </li>)}
          </ul>
        </div>)}

      <style jsx global>{`
        @keyframes popIn { from { opacity: 0; transform: scale(0.9) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </header>);
}
