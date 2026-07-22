import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { services } from "@/lib/data";
export const metadata = { title: "Services | GLOW 'N' GO Beauty & Cosmetics" };
const categories = ["Hair", "Nails", "Makeup", "Skin", "Grooming"];
export default function ServicesPage() {
    return (<div className="mx-auto max-w-6xl px-5 py-16">
      <p className="eyebrow">Our menu</p>
      <h1 className="mt-2 text-4xl">Services</h1>
      <p className="mt-3 max-w-xl text-ink/70">
        Every service is booked online with a confirmed time slot — no guessing, no long waits.
      </p>

      {categories.map((cat) => {
            const items = services.filter((s) => s.category === cat);
            if (!items.length)
                return null;
            return (<div key={cat} className="mt-14">
            <h2 className="text-2xl">{cat}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (<div key={s.slug} className="card overflow-hidden">
                  <div className="relative h-44 w-full">
                    <SafeImage src={s.image} alt={s.name} fill className="object-cover"/>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg">{s.name}</h3>
                    <p className="mt-1 text-sm text-ink/60">{s.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-medium">KES {s.price.toLocaleString()}</span>
                      <span className="text-ink/50">{s.durationMins} mins</span>
                    </div>
                    <Link href={`/book-appointment?service=${s.slug}`} className="btn-primary mt-5 w-full">
                      Book this service
                    </Link>
                  </div>
                </div>))}
            </div>
          </div>);
        })}
    </div>);
}
