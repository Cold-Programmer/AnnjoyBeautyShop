"use client";
import { createContext, useContext, useEffect, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const AuthContext = createContext(undefined);
/** Where each role should land after login / when they click "Dashboard". */
export function dashboardPathFor(role) {
    switch (role) {
        case "ADMIN": return "/admin";
        case "STAFF": return "/staff";
        case "STYLIST": return "/stylist";
        default: return "/dashboard";
    }
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    async function refresh() {
        try {
            const res = await fetch(`${API}/api/auth/me`, { credentials: "include" });
            if (!res.ok) {
                setUser(null);
                return;
            }
            const data = await res.json();
            setUser(data.user);
        }
        catch {
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    }
    async function logout() {
        await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" }).catch(() => { });
        setUser(null);
        window.location.href = "/login"; // full reload — guarantees no stale client state survives the switch to another account
    }
    useEffect(() => {
        refresh();
    }, []);
    return <AuthContext.Provider value={{ user, loading, refresh, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
