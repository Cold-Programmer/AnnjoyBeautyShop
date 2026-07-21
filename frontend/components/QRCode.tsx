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
export default function QRCode({ value, size = 120 }: { value: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    // Resolve a relative path to an absolute URL here (client-side, post
    // hydration) rather than in a server component, where `window` isn't
    // available and would always resolve to an empty string.
    const resolvedValue = value.startsWith("/") ? `${window.location.origin}${value}` : value;
    QRCodeLib.toCanvas(canvasRef.current, resolvedValue, {
      width: size,
      margin: 1,
      color: { dark: "#1C1614", light: "#00000000" }, // ink on transparent, matches the design system
    }).catch(() => setError(true));
  }, [value, size]);

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-md bg-ink/5 text-[10px] text-ink/40"
      >
        QR unavailable
      </div>
    );
  }

  return <canvas ref={canvasRef} width={size} height={size} aria-label="QR code" role="img" />;
}
