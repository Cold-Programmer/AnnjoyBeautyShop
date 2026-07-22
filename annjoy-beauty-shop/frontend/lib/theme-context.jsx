"use client";
import { createContext, useContext, useEffect, useState } from "react";
const STORAGE_KEY = "glow-n-go-theme";
const ThemeContext = createContext(undefined);
function applyTheme(theme) {
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
}
export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState("system");
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) || "system";
        setThemeState(stored);
        applyTheme(stored);
        // Follow OS changes live when set to "system".
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => {
            if (localStorage.getItem(STORAGE_KEY) === "system")
                applyTheme("system");
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);
    function setTheme(t) {
        setThemeState(t);
        localStorage.setItem(STORAGE_KEY, t);
        applyTheme(t);
    }
    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx)
        throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}
