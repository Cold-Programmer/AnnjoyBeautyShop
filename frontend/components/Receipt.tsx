"use client";

import { businessInfo } from "@/lib/data";

export interface ReceiptOrder {
  id: string;
  createdAt: string;
  items: { product: { name: string }; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  mpesaReceiptNo?: string | null;
  deliveryAddress: string;
}

/**
 * Printer-friendly receipt. "Compatible with all printers" in practice
 * means: no color-dependent layout, standard page width, no fixed
 * pixel-perfect positioning — the actual printer driver/dialog handles
 * paper size and DPI, which is the browser's job, not something app code
 * controls per-printer model.
 */
export default function Receipt({ order }: { order: ReceiptOrder }) {
  return (
    <div className="mx-auto max-w-sm rounded-xl2 border border-ink/10 bg-white p-6 print:border-0 print:shadow-none">
      <div className="text-center">
        <p className="font-display text-lg">{businessInfo.name}</p>
        <p className="text-xs text-ink/50">{businessInfo.location}</p>
        <p className="text-xs text-ink/50">{businessInfo.phone}</p>
      </div>
      <div className="my-4 border-t border-dashed border-ink/20" />
      <p className="text-xs text-ink/50">Order: {order.id}</p>
      <p className="text-xs text-ink/50">{new Date(order.createdAt).toLocaleString()}</p>
      <div className="my-4 border-t border-dashed border-ink/20" />
      <table className="w-full text-sm">
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i}>
              <td className="py-1">{item.product.name} × {item.quantity}</td>
              <td className="py-1 text-right">KES {(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="my-4 border-t border-dashed border-ink/20" />
      <div className="space-y-1 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>KES {order.subtotal.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>KES {order.shipping.toLocaleString()}</span></div>
        <div className="flex justify-between font-semibold"><span>Total</span><span>KES {order.total.toLocaleString()}</span></div>
      </div>
      {order.mpesaReceiptNo && (
        <>
          <div className="my-4 border-t border-dashed border-ink/20" />
          <p className="text-xs text-ink/50">M-Pesa receipt: {order.mpesaReceiptNo}</p>
        </>
      )}
      <div className="my-4 border-t border-dashed border-ink/20" />
      <p className="text-center text-xs text-ink/40">Thank you for shopping with us!</p>

      <button
        onClick={() => window.print()}
        className="btn-primary mt-6 w-full print:hidden"
      >
        Print receipt
      </button>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-print, #receipt-print * { visibility: visible; }
          #receipt-print { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
