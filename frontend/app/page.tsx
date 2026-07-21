import Link from "next/link";
import Image from "next/image";
import { services, products, testimonials, businessInfo } from "@/lib/data";
import QRCode from "@/components/QRCode";

export default function HomePage() {
  const featuredServices = services.slice(0, 4);
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      {/* HERO — signature element: a boutique "appointment ticket" card */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blush/40 via-cream to-cream" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 md:grid-cols-2 md:pt-24">
          <div>
            <p className="eyebrow">Ndagani · Tharaka Nithi County</p>
            <h1 className="mt-4 text-4xl leading-[1.05] md:text-6xl">
              Beauty, done with <span className="italic text-rosegold-dark">care</span>.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink/70">
              Hair, nails, makeup and skin services — plus the products to keep
              your look going at home. Book a chair or shop the range, all in
              one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/book-appointment" className="btn-primary">Book an appointment</Link>
              <Link href="/shop" className="btn-secondary">Shop products</Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-ink/60">
              <span>★★★★★ 4.8 average rating</span>
              <span className="divider-gold hidden md:block" />
              <span>{businessInfo.phone}</span>
            </div>
          </div>

          {/* Ticket card */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="ticket-notch rounded-xl2 border border-ink/10 bg-white p-7 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Appointment</p>
                <span className="text-xs text-ink/40">No. 0148</span>
              </div>
              <div className="my-5 border-t border-dashed border-ink/15" />
              <p className="font-display text-2xl">Bridal Makeup</p>
              <p className="mt-1 text-sm text-ink/60">with Claudia Mwende</p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-ink/40">Date</p>
                  <p className="font-medium">Sat, 12:00 PM</p>
                </div>
                <div>
                  <p className="text-ink/40">Duration</p>
                  <p className="font-medium">120 mins</p>
                </div>
              </div>
              <div className="my-5 border-t border-dashed border-ink/15" />
              <div className="flex items-center justify-between">
                <p className="text-xs text-ink/40">Scan to book</p>
                <QRCode value="/book-appointment" size={56} />
              </div>
            </div>
            <div className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-xl2 bg-gold/25" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">What we do</p>
            <h2 className="mt-2 text-3xl">Featured services</h2>
          </div>
          <Link href="/services" className="hidden text-sm font-medium text-rosegold-dark hover:underline md:block">
            View all services →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((s) => (
            <Link key={s.slug} href="/services" className="card group overflow-hidden">
              <div className="relative h-40 w-full overflow-hidden">
                <Image src={s.image} alt={s.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className="eyebrow">{s.category}</p>
                <h3 className="mt-1 text-lg">{s.name}</h3>
                <div className="mt-3 flex items-center justify-between text-sm text-ink/60">
                  <span>KES {s.price.toLocaleString()}</span>
                  <span>{s.durationMins} mins</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-blush/30 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Shop the range</p>
              <h2 className="mt-2 text-3xl">Popular products</h2>
            </div>
            <Link href="/shop" className="hidden text-sm font-medium text-rosegold-dark hover:underline md:block">
              View all products →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((p) => (
              <Link key={p.slug} href="/shop" className="card group overflow-hidden bg-white">
                <div className="relative h-44 w-full overflow-hidden">
                  <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="eyebrow">{p.category}</p>
                  <h3 className="mt-1 text-base">{p.name}</h3>
                  <p className="mt-2 font-medium">KES {p.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow text-center">Loved locally</p>
        <h2 className="mt-2 text-center text-3xl">What our clients say</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <p className="text-gold">{"★".repeat(t.rating)}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">"{t.quote}"</p>
              <p className="mt-4 text-sm font-medium">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex flex-col items-center gap-6 rounded-xl2 bg-ink px-8 py-14 text-center text-cream md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-3xl">Ready for your next appointment?</h2>
            <p className="mt-2 text-cream/70">Walk-ins welcome, but booking online guarantees your slot.</p>
          </div>
          <Link href="/book-appointment" className="btn-primary bg-gold text-ink hover:bg-gold-soft">
            Book an appointment
          </Link>
        </div>
      </section>
    </>
  );
}
