"use client";
import Image from "next/image";
import { useState } from "react";
/**
 * Wraps next/image with a graceful fallback when the remote URL 404s or
 * times out — this is what actually, permanently fixes "broken image"
 * reports, regardless of whether a specific Unsplash photo ID is still
 * valid tomorrow. A dead link degrades to a soft branded placeholder
 * instead of a broken-image icon or a thrown request error.
 */
export default function SafeImage({ alt, className, ...props }) {
    const [failed, setFailed] = useState(false);
    if (failed) {
        return (<div className={`flex items-center justify-center bg-gradient-to-br from-blush to-rosegold-light/40 text-center ${className || ""}`} style={{ width: "100%", height: "100%" }} role="img" aria-label={alt}>
        <div className="px-4">
          <svg className="mx-auto opacity-40" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="9" cy="9" r="1.5"/>
            <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="mt-1 text-[10px] uppercase tracking-wide text-ink/40">{alt}</p>
        </div>
      </div>);
    }
    return <Image alt={alt} className={className} onError={() => setFailed(true)} {...props}/>;
}
