import { businessInfo } from "@/lib/data";
export default function WhatsAppButton() {
    return (<a href={`https://wa.me/${businessInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform hover:scale-105">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.51 3.62 1.4 5.12L2 22l5.13-1.49a9.9 9.9 0 0 0 4.9 1.3h.01c5.46 0 9.91-4.45 9.91-9.9S17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.37-.5.07-1.02.1-3.4-.85-2.86-1.14-4.7-4.04-4.85-4.23-.14-.19-1.16-1.55-1.16-2.95s.72-2.09.98-2.38c.24-.27.55-.34.73-.34h.53c.17 0 .4-.03.62.47.24.55.8 1.9.87 2.04.07.14.12.3.02.49-.1.19-.15.3-.29.46-.15.17-.31.38-.44.51-.15.14-.3.3-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.39 1.47.3.14.48.12.66-.07.19-.19.79-.92.99-1.24.2-.31.4-.26.68-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.34.08.13.08.75-.16 1.44Z"/>
      </svg>
    </a>);
}
