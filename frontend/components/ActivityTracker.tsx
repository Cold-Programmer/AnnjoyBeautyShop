"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/** Fires a page-view event to the backend on every route change — powers
 * the admin Users page's activity trail. See ActivityLog's doc-comment
 * in schema.prisma for why this is page-level, not full click tracking. */
export default function ActivityTracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch(`${API}/api/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {}); // never let analytics break the page
  }, [pathname]);

  return null;
}
