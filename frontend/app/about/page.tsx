import Image from "next/image";
import { businessInfo } from "@/lib/data";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <p className="eyebrow">Our story</p>
      <h1 className="mt-2 text-4xl">About GLOW 'N' GO Beauty & Cosmetics</h1>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl2">
        <Image src="https://images.unsplash.com/photo-1522337094846-8a8991e7f4a3?w=1200&q=80" alt="Salon interior" fill className="object-cover" />
      </div>
      <div className="mt-8 space-y-4 text-ink/75 leading-relaxed">
        <p>
          Founded by {businessInfo.owner}, GLOW 'N' GO Beauty & Cosmetics is a hair, nail, makeup and skin
          care destination in {businessInfo.location}. What started as a single chair has grown
          into a full-service salon and cosmetics store, serving women, men, brides, students and
          professionals across Tharaka Nithi County.
        </p>
        <p>
          We believe beauty care should feel personal and unhurried — every service is booked with
          a confirmed time, so you're never left waiting. Alongside our salon services, we stock a
          curated range of hair, skin, and makeup products so you can keep your look going at home.
        </p>
      </div>
    </div>
  );
}
