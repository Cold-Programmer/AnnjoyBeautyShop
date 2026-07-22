"use client";
import { useEffect, useRef, useState } from "react";
import QRCodeLib from "qrcode";
/**
 * Renders a REAL, scannable QR code to a canvas (client-side, via the
 * `qrcode` package) — replaces the fake decorative pixel-grid that used
 * to sit in the homepage hero card.
 *
 * Security note: the uniqueness/security promise here comes from WHAT
 * `value` encodes, not from this component. For a real appointment, pass
 * a URL containing that appointment's unique `qrToken` (see
 * backend/prisma/schema.prisma's Appointment.qrToken doc-comment) —
 * never a sequential appointment id, or one customer could guess another
 * customer's ticket URL.
 */
export default function QRCode({ value, size = 120 }) {
    const canvasRef = useRef(null);
    const [error, setError] = useState(false);
    useEffect(() => {
        if (!canvasRef.current)
            return;
        // Resolve a relative path to an absolute URL. IMPORTANT for scanning
        // with a phone camera: "localhost" means "this device" to whichever
        // device opens the link — a QR generated from window.location.origin
        // on your PC (http://localhost:3000) is only reachable FROM that same
        // PC. A phone scanning it will always get "connection refused",
        // because on the phone, localhost means the phone itself.
        //
        // Fix: set NEXT_PUBLIC_SITE_URL in frontend/.env.local to an address
        // your phone can actually reach — e.g. your computer's LAN IP while
        // testing on the same WiFi (http://192.168.x.x:3000), or your ngrok/
        // production domain. This is a networking fact, not a bug in this
        // component — no code can make "localhost" mean something reachable
        // from a different physical device.
        const base = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
        const resolvedValue = value.startsWith("/") ? `${base}${value}` : value;
        QRCodeLib.toCanvas(canvasRef.current, resolvedValue, {
            width: size,
            margin: 1,
            color: { dark: "#1C1614", light: "#00000000" }, // ink on transparent, matches the design system
        }).catch(() => setError(true));
    }, [value, size]);
    if (error) {
        return (<div style={{ width: size, height: size }} className="flex items-center justify-center rounded-md bg-ink/5 text-[10px] text-ink/40">
        QR unavailable
      </div>);
    }
    return <canvas ref={canvasRef} width={size} height={size} aria-label="QR code" role="img"/>;
}
