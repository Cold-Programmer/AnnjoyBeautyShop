"use client";
/**
 * The "unique pop-up confirmation animation" for a successful M-Pesa
 * payment — shown to the customer once polling detects SUCCESS. Pure
 * CSS animation (no extra animation library needed for one modal).
 */
export default function PaymentConfirmedModal({ onClose, receiptNo }) {
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm animate-[fadeIn_0.25s_ease-out]">
      <div className="w-full max-w-sm rounded-xl2 bg-white p-8 text-center shadow-soft animate-[popIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 animate-[checkPulse_0.6s_ease-out]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="mt-5 text-2xl">Payment confirmed ✓</h2>
        <p className="mt-2 text-sm text-ink/60">
          {receiptNo ? `M-Pesa receipt ${receiptNo}. ` : ""}Your order is now being prepared.
        </p>
        <button onClick={onClose} className="btn-primary mt-6 w-full">Done</button>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.85) } to { opacity: 1; transform: scale(1) } }
        @keyframes checkPulse { 0% { transform: scale(0.6); opacity: 0 } 60% { transform: scale(1.1) } 100% { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>);
}
