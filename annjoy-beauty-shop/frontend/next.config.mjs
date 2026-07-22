/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Unoptimized: the Next dev server was proxying every remote image
    // through its own image-optimization route, which is what caused the
    // "upstream image response failed ... ETIMEDOUT / 404" terminal
    // errors — that's the SERVER trying (and failing) to fetch the image
    // itself. With this off, the browser requests the image directly,
    // which is both more reliable on flaky networks and matches what
    // SafeImage's onError fallback (components/SafeImage.tsx) expects.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};
export default nextConfig;
