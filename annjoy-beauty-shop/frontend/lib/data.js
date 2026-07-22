// Central mock/catalog data for Annjoy Beauty Shop.
// In production this is replaced by fetches to the backend API
// (see backend/src/controllers/{services,products}.controller.ts).
export const services = [
    { slug: "braiding", name: "Classic Braiding", category: "Hair", description: "Neat, long-lasting braids styled to suit your face shape and hair type.", price: 1500, durationMins: 150, image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80" },
    { slug: "hair-treatment", name: "Deep Hair Treatment", category: "Hair", description: "Restorative treatment for dry, damaged, or chemically treated hair.", price: 1200, durationMins: 60, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" },
    { slug: "hair-coloring", name: "Hair Coloring", category: "Hair", description: "Professional color application, from subtle tones to bold statements.", price: 2500, durationMins: 120, image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80" },
    { slug: "wig-installation", name: "Wig Installation", category: "Hair", description: "Natural-looking wig fitting and styling, glue or glueless.", price: 2000, durationMins: 90, image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&q=80" },
    { slug: "manicure", name: "Classic Manicure", category: "Nails", description: "Shape, cuticle care, and polish for healthy, elegant nails.", price: 700, durationMins: 45, image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80" },
    { slug: "gel-polish", name: "Gel Polish", category: "Nails", description: "Chip-resistant, glossy gel polish in your choice of shade.", price: 1000, durationMins: 60, image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&q=80" },
    { slug: "nail-art", name: "Nail Art", category: "Nails", description: "Custom hand-painted designs to finish your manicure in style.", price: 1300, durationMins: 75, image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&q=80" },
    { slug: "bridal-makeup", name: "Bridal Makeup", category: "Makeup", description: "Full bridal look with trial session, built to last your entire day.", price: 6000, durationMins: 120, image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80" },
    { slug: "party-makeup", name: "Party Makeup", category: "Makeup", description: "Glam makeup for events, graduations, and nights out.", price: 2500, durationMins: 60, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80" },
    { slug: "facial", name: "Signature Facial", category: "Skin", description: "Deep-cleansing facial tailored to your skin type.", price: 1800, durationMins: 60, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80" },
    { slug: "eyebrows-lashes", name: "Eyebrows & Lashes", category: "Skin", description: "Shaping, tinting, and lash lifts for a polished, natural finish.", price: 900, durationMins: 40, image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800&q=80" },
    { slug: "mens-grooming", name: "Men's Grooming", category: "Grooming", description: "Haircut, beard shaping, and skin care built for men.", price: 800, durationMins: 45, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80" },
];
export const products = [
    { id: "argan-hair-oil", slug: "argan-hair-oil", name: "Argan Hair Oil", category: "Hair Care", description: "Nourishing oil for shine and split-end repair.", price: 950, compareAtPrice: 1200, stock: 24, rating: 4.7, reviewCount: 38, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80" },
    { id: "vitamin-c-serum", slug: "vitamin-c-serum", name: "Vitamin C Brightening Serum", category: "Skin Care", description: "Daily serum for an even, radiant complexion.", price: 1600, stock: 15, rating: 4.8, reviewCount: 52, image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80" },
    { id: "matte-lipstick-set", slug: "matte-lipstick-set", name: "Matte Lipstick Set (3pc)", category: "Makeup", description: "Long-wear matte lipsticks in universally flattering shades.", price: 1400, stock: 30, rating: 4.6, reviewCount: 27, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80" },
    { id: "rose-eau-de-parfum", slug: "rose-eau-de-parfum", name: "Rose Gold Eau de Parfum", category: "Perfumes", description: "Warm floral fragrance with notes of rose and amber.", price: 3200, stock: 12, rating: 4.9, reviewCount: 19, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80" },
    { id: "gel-polish-kit", slug: "gel-polish-kit", name: "At-Home Gel Polish Kit", category: "Nail Products", description: "Salon-quality gel polish kit with curing lamp.", price: 2800, stock: 9, rating: 4.5, reviewCount: 14, image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&q=80" },
    { id: "silk-hair-scarf", slug: "silk-hair-scarf", name: "Silk Hair Scarf", category: "Accessories", description: "Protects braids and natural hair while you sleep.", price: 650, stock: 40, rating: 4.7, reviewCount: 21, image: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=800&q=80" },
    { id: "shea-body-butter", slug: "shea-body-butter", name: "Shea Body Butter", category: "Skin Care", description: "Rich, fast-absorbing butter for soft, hydrated skin.", price: 850, stock: 33, rating: 4.6, reviewCount: 44, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80" },
    { id: "hydrating-face-mist", slug: "hydrating-face-mist", name: "Hydrating Face Mist", category: "Skin Care", description: "Refreshing mist with aloe and rose water.", price: 700, stock: 26, rating: 4.4, reviewCount: 18, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80" },
];
export const testimonials = [
    { name: "Wanjiru K.", quote: "The braiding session was worth every shilling — neat, fast, and gentle on my scalp.", rating: 5 },
    { name: "Faith M.", quote: "My bridal makeup lasted the entire wedding, through tears and dancing.", rating: 5 },
    { name: "Brian O.", quote: "Best grooming spot in Tharaka Nithi. Booking online saved me so much time.", rating: 5 },
];
export const businessInfo = {
    name: "GLOW 'N' GO Beauty & Cosmetics",
    shortName: "GLOW 'N' GO",
    owner: "Annjoy Muthoni",
    phone: "0722 503 692",
    whatsapp: "254722503692",
    location: "Ndagani, Opposite Chuka University, Tharaka Nithi County, Kenya",
    tillNumber: "6948840",
    hours: [
        { day: "Mon – Fri", time: "8:00 AM – 7:00 PM" },
        { day: "Saturday", time: "8:00 AM – 8:00 PM" },
        { day: "Sunday", time: "10:00 AM – 5:00 PM" },
    ],
    // Admin-configurable in a later pass (see README) — centralized here for
    // now so every page/component reads from one place instead of
    // hardcoding links independently.
    social: {
        facebook: "https://facebook.com/glowngobeauty",
        instagram: "https://instagram.com/glow_n_go_beauty_shop",
        tiktok: "https://tiktok.com/@glow_n_go_beauty_shop", // verify exact handle — see README
    },
    stylist: {
        name: "Claudia Mwende",
        phone: "0743 427 511",
        title: "Lead Beauty Stylist",
        bio: "Certified by Vera Beauty College, graduating among the top students in her class. Expert across hair, nails, makeup, facials and grooming services.",
    },
};
