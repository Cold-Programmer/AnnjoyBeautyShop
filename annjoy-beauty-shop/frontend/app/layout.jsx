import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ActivityTracker from "@/components/ActivityTracker";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
// Loaded via <link> rather than next/font/google so the production build
// doesn't depend on build-time network access to fonts.googleapis.com
// (e.g. some CI/sandbox environments restrict that domain). Swap for
// next/font/google once you confirm your build host can reach it, for
// automatic self-hosting/subsetting.
export const metadata = {
    title: "GLOW 'N' GO Beauty & Cosmetics | Hair, Nails, Makeup & Cosmetics — Tharaka Nithi",
    description: "Premium beauty salon and cosmetics store in Ndagani, Tharaka Nithi County. Book hair, nail, makeup and skin appointments, or shop beauty products online.",
    openGraph: {
        title: "GLOW 'N' GO Beauty & Cosmetics",
        description: "Premium beauty salon and cosmetics store in Ndagani, Tharaka Nithi County, Kenya.",
        type: "website",
    },
};
export default function RootLayout({ children }) {
    return (<html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      </head>
      <body>
        {/* Runs before paint — prevents a light-mode flash for users
            who saved a "dark" preference, since the class has to be on
            <html> before React hydrates. */}
        <script dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('glow-n-go-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}`,
        }}/>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <ActivityTracker />
              <Navbar />
              <main>{children}</main>
              <Footer />
              <WhatsAppButton />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>);
}
