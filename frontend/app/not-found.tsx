import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-4xl">Page not found</h1>
      <p className="mt-3 text-ink/60">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="btn-primary">Back home</Link>
        <Link href="/shop" className="btn-secondary">Browse shop</Link>
      </div>
    </div>
  );
}
