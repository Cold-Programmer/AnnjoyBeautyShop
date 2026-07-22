"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Seeding GLOW 'N' GO Beauty & Cosmetics data...");
    // --- Users ---
    const admin = await prisma.user.upsert({
        where: { email: "admin@glowngo.co.ke" },
        update: {},
        create: {
            firstName: "Annjoy",
            lastName: "Muthoni",
            email: "admin@glowngo.co.ke",
            phone: "254722503692",
            passwordHash: await bcryptjs_1.default.hash("ChangeMe123!", 12),
            role: "ADMIN",
            emailVerified: true, // seeded accounts skip the OTP flow
        },
    });
    // The stylist who actually performs services — separate from Annjoy
    // (the owner/admin). Seeded with STAFF role so she can log in and
    // manage her own appointments, update stock, etc.
    const claudia = await prisma.user.upsert({
        where: { email: "claudia@glowngo.co.ke" },
        update: {},
        create: {
            firstName: "Claudia",
            lastName: "Mwende",
            email: "claudia@glowngo.co.ke",
            phone: "254743427511",
            passwordHash: await bcryptjs_1.default.hash("ChangeMe123!", 12),
            role: "STYLIST",
            title: "Lead Beauty Stylist",
            bio: "Certified by Vera Beauty College, graduating among the top students in her class. Expert across hair, nails, makeup, facials and grooming services.",
            emailVerified: true,
        },
    });
    // A dedicated STAFF account (inventory/orders — distinct from Claudia's
    // hands-on STYLIST role), since the brief asks for both to exist.
    const staff = await prisma.user.upsert({
        where: { email: "staff@glowngo.co.ke" },
        update: {},
        create: {
            firstName: "Grace",
            lastName: "Kendi",
            email: "staff@glowngo.co.ke",
            phone: "254700111222",
            passwordHash: await bcryptjs_1.default.hash("ChangeMe123!", 12),
            role: "STAFF",
            title: "Inventory & Orders",
            emailVerified: true,
        },
    });
    // Demo CUSTOMER account — new visitors can also self-register via
    // /register (with email OTP verification); this seeded account is just
    // for quick manual testing without going through that flow.
    const demoCustomer = await prisma.user.upsert({
        where: { email: "customer@glowngo.co.ke" },
        update: {},
        create: {
            firstName: "Faith",
            lastName: "Wanjiru",
            email: "customer@glowngo.co.ke",
            phone: "254711222333",
            passwordHash: await bcryptjs_1.default.hash("ChangeMe123!", 12),
            role: "CUSTOMER",
            emailVerified: true,
        },
    });
    // --- Service categories & services (open to all genders/ages) ---
    const serviceCategories = ["Hair", "Nails", "Makeup", "Skin", "Grooming"];
    const svcCatMap = {};
    for (const name of serviceCategories) {
        const cat = await prisma.serviceCategory.upsert({
            where: { slug: name.toLowerCase() },
            update: {},
            create: { name, slug: name.toLowerCase() },
        });
        svcCatMap[name] = cat.id;
    }
    const services = [
        { name: "Classic Braiding", slug: "braiding", category: "Hair", price: 1500, durationMins: 150, description: "Neat, long-lasting braids styled to suit your face shape and hair type." },
        { name: "Deep Hair Treatment", slug: "hair-treatment", category: "Hair", price: 1200, durationMins: 60, description: "Restorative treatment for dry, damaged, or chemically treated hair." },
        { name: "Kids Haircut", slug: "kids-haircut", category: "Hair", price: 500, durationMins: 30, description: "Gentle, patient haircuts for children of all ages." },
        { name: "Men's Haircut & Fade", slug: "mens-haircut", category: "Hair", price: 700, durationMins: 40, description: "Sharp, precise cuts and fades for men and boys." },
        { name: "Classic Manicure", slug: "manicure", category: "Nails", price: 700, durationMins: 45, description: "Shape, cuticle care, and polish for healthy, elegant nails." },
        { name: "Gel Polish", slug: "gel-polish", category: "Nails", price: 1000, durationMins: 60, description: "Chip-resistant, glossy gel polish in your choice of shade." },
        { name: "Bridal Makeup", slug: "bridal-makeup", category: "Makeup", price: 6000, durationMins: 120, description: "Full bridal look with trial session, built to last your entire day." },
        { name: "Signature Facial", slug: "facial", category: "Skin", price: 1800, durationMins: 60, description: "Deep-cleansing facial tailored to your skin type — suitable for all ages." },
        { name: "Men's Grooming", slug: "mens-grooming", category: "Grooming", price: 800, durationMins: 45, description: "Haircut, beard shaping, and skin care built for men and boys." },
        { name: "Beard Trim & Shape", slug: "beard-trim", category: "Grooming", price: 500, durationMins: 25, description: "Precision beard shaping and grooming." },
    ];
    for (const s of services) {
        const { category, ...data } = s; // category is only used to look up categoryId — must not be spread into Prisma's create()
        await prisma.service.upsert({
            where: { slug: s.slug },
            update: {},
            create: { ...data, categoryId: svcCatMap[category] },
        });
    }
    // --- Product categories & products (Men / Women / Unisex / Kids) ---
    const productCategories = ["Hair Care", "Skin Care", "Makeup", "Perfumes", "Nail Products", "Accessories", "Men's Care", "Body Care", "Gift Sets", "Beauty Tools"];
    const prodCatMap = {};
    for (const name of productCategories) {
        const cat = await prisma.productCategory.upsert({
            where: { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") },
            update: {},
            create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") },
        });
        prodCatMap[name] = cat.id;
    }
    // Each product gets its OWN distinct image — the previous seed left
    // imageUrl unset, so every product fell back to the same one generic
    // placeholder in the shop page. That was the actual cause of "all shop
    // images look the same", not a broken-link issue.
    const products = [
        { name: "Argan Hair Oil", slug: "argan-hair-oil", category: "Hair Care", price: 950, stock: 24, description: "Nourishing oil for shine and split-end repair.", gender: "UNISEX", imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80" },
        { name: "Vitamin C Brightening Serum", slug: "vitamin-c-serum", category: "Skin Care", price: 1600, stock: 15, description: "Daily serum for an even, radiant complexion.", gender: "UNISEX", imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80" },
        { name: "Matte Lipstick Set (3pc)", slug: "matte-lipstick-set", category: "Makeup", price: 1400, stock: 30, description: "Long-wear matte lipsticks in universally flattering shades.", gender: "WOMEN", imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80" },
        { name: "Rose Gold Eau de Parfum", slug: "rose-eau-de-parfum", category: "Perfumes", price: 3200, stock: 12, description: "Warm floral fragrance with notes of rose and amber.", gender: "WOMEN", imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80" },
        { name: "At-Home Gel Polish Kit", slug: "gel-polish-kit", category: "Nail Products", price: 2800, stock: 9, description: "Salon-quality gel polish kit with curing lamp.", gender: "UNISEX", imageUrl: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&q=80" },
        { name: "Silk Hair Scarf", slug: "silk-hair-scarf", category: "Accessories", price: 650, stock: 40, description: "Protects braids and natural hair while you sleep.", gender: "UNISEX", imageUrl: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=800&q=80" },
        { name: "Men's Beard Oil", slug: "mens-beard-oil", category: "Men's Care", price: 900, stock: 20, description: "Softens and conditions facial hair, reduces itch.", gender: "MEN", imageUrl: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80" },
        { name: "Men's Charcoal Face Wash", slug: "mens-charcoal-face-wash", category: "Men's Care", price: 700, stock: 22, description: "Deep-cleansing face wash for oily and combination skin.", gender: "MEN", imageUrl: "https://images.unsplash.com/photo-1585232351009-aa87416fca90?w=800&q=80" },
        { name: "Cologne for Men", slug: "cologne-for-men", category: "Perfumes", price: 2900, stock: 10, description: "Woody, confident scent for everyday wear.", gender: "MEN", imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80" },
        { name: "Kids Gentle Shampoo", slug: "kids-gentle-shampoo", category: "Hair Care", price: 550, stock: 25, description: "Tear-free, sulphate-free shampoo safe for children.", gender: "KIDS", imageUrl: "https://images.unsplash.com/photo-1585232351009-aa87416fca90?w=800&q=80" },
        { name: "Kids Fruity Lip Balm Set", slug: "kids-lip-balm-set", category: "Skin Care", price: 400, stock: 30, description: "Fun, safe lip balms in kid-friendly flavours.", gender: "KIDS", imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80" },
        { name: "Shea Body Butter", slug: "shea-body-butter", category: "Body Care", price: 850, stock: 33, description: "Rich, fast-absorbing butter for soft, hydrated skin.", gender: "UNISEX", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80" },
        { name: "Hydrating Face Mist", slug: "hydrating-face-mist", category: "Skin Care", price: 700, stock: 26, description: "Refreshing mist with aloe and rose water.", gender: "UNISEX", imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80" },
        { name: "Bridal Beauty Gift Set", slug: "bridal-gift-set", category: "Gift Sets", price: 4500, stock: 8, description: "Curated skincare and makeup set for the bride-to-be.", gender: "WOMEN", imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80" },
        { name: "Professional Makeup Brush Set", slug: "makeup-brush-set", category: "Beauty Tools", price: 1800, stock: 18, description: "12-piece brush set for flawless application.", gender: "UNISEX", imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80" },
    ];
    for (const p of products) {
        const { category, ...data } = p; // same fix as services — never spread the lookup key into create()
        await prisma.product.upsert({
            where: { slug: p.slug },
            update: {},
            create: { ...data, categoryId: prodCatMap[category] },
        });
    }
    console.log(`Seeded.`);
    console.log(`Admin login:   admin@glowngo.co.ke / ChangeMe123! (id ${admin.id})`);
    console.log(`Stylist login: claudia@glowngo.co.ke / ChangeMe123! (id ${claudia.id})`);
    console.log(`Staff login:   staff@glowngo.co.ke / ChangeMe123! (id ${staff.id})`);
    console.log(`Customer login: customer@glowngo.co.ke / ChangeMe123! (id ${demoCustomer.id})`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
