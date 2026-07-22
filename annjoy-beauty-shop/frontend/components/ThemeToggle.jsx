"use client";
import { useTheme } from "@/lib/theme-context";
const OPTIONS = [
    { value: "light", label: "Light", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36l-.7-.7M6.34 6.34l-.7-.7m12.02 0l-.7.7M6.34 17.66l-.7.7M12 8a4 4 0 100 8 4 4 0 000-8Z" },
    { value: "dark", label: "Dark", icon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z" },
    { value: "system", label: "System", icon: "M4 5h16v10H4zM8 21h8M12 15v6" },
];
/** Relocated next to the navbar per feedback — previously this only
 * lived (non-functionally) inside Settings, several clicks away. */
export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (<div className="flex items-center rounded-full border border-ink/10 p-0.5 dark:border-cream/15">
      {OPTIONS.map((opt) => (<button key={opt.value} onClick={() => setTheme(opt.value)} aria-label={`${opt.label} theme`} aria-pressed={theme === opt.value} className={`rounded-full p-1.5 transition-colors ${theme === opt.value ? "bg-ink text-cream dark:bg-cream dark:text-ink" : "text-ink/50 hover:text-ink dark:text-cream/50 dark:hover:text-cream"}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={opt.icon} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>))}
    </div>);
}
