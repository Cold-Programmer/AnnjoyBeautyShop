import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
      passwordHash: await bcrypt.hash("ChangeMe123!", 12),
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
      passwordHash: await bcrypt.hash("ChangeMe123!", 12),
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
      passwordHash: await bcrypt.hash("ChangeMe123!", 12),
      role: "STAFF",
      title: "Inventory & Orders",
      emailVerified: true,
    },
  });

  // --- Service categories & services (open to all genders/ages) ---
  const serviceCategories = ["Hair", "Nails", "Makeup", "Skin", "Grooming"];
  const svcCatMap: Record<string, string> = {};
  for (const name of serviceCategories) {
    const cat = await prisma.serviceCategory.upsert({
      where: { slug: name.toLowerCase() },
      update: {},
      create: { name, slug: name.toLowerCase() },
    });
    svcCatMap[name] = cat.id;
  }

  const services: { name: string; slug: string; category: string; price: number; durationMins: number; description: string }[] = [
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
  const prodCatMap: Record<string, string> = {};
  for (const name of productCategories) {
    const cat = await prisma.productCategory.upsert({
      where: { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") },
    });
    prodCatMap[name] = cat.id;
  }

  const products: { name: string; slug: string; category: string; price: number; stock: number; description: string; gender: "MEN" | "WOMEN" | "UNISEX" | "KIDS" }[] = [
    { name: "Argan Hair Oil", slug: "argan-hair-oil", category: "Hair Care", price: 950, stock: 24, description: "Nourishing oil for shine and split-end repair.", gender: "UNISEX" },
    { name: "Vitamin C Brightening Serum", slug: "vitamin-c-serum", category: "Skin Care", price: 1600, stock: 15, description: "Daily serum for an even, radiant complexion.", gender: "UNISEX" },
    { name: "Matte Lipstick Set (3pc)", slug: "matte-lipstick-set", category: "Makeup", price: 1400, stock: 30, description: "Long-wear matte lipsticks in universally flattering shades.", gender: "WOMEN" },
    { name: "Rose Gold Eau de Parfum", slug: "rose-eau-de-parfum", category: "Perfumes", price: 3200, stock: 12, description: "Warm floral fragrance with notes of rose and amber.", gender: "WOMEN" },
    { name: "At-Home Gel Polish Kit", slug: "gel-polish-kit", category: "Nail Products", price: 2800, stock: 9, description: "Salon-quality gel polish kit with curing lamp.", gender: "UNISEX" },
    { name: "Silk Hair Scarf", slug: "silk-hair-scarf", category: "Accessories", price: 650, stock: 40, description: "Protects braids and natural hair while you sleep.", gender: "UNISEX" },
    { name: "Men's Beard Oil", slug: "mens-beard-oil", category: "Men's Care", price: 900, stock: 20, description: "Softens and conditions facial hair, reduces itch.", gender: "MEN" },
    { name: "Men's Charcoal Face Wash", slug: "mens-charcoal-face-wash", category: "Men's Care", price: 700, stock: 22, description: "Deep-cleansing face wash for oily and combination skin.", gender: "MEN" },
    { name: "Cologne for Men", slug: "cologne-for-men", category: "Perfumes", price: 2900, stock: 10, description: "Woody, confident scent for everyday wear.", gender: "MEN" },
    { name: "Kids Gentle Shampoo", slug: "kids-gentle-shampoo", category: "Hair Care", price: 550, stock: 25, description: "Tear-free, sulphate-free shampoo safe for children.", gender: "KIDS" },
    { name: "Kids Fruity Lip Balm Set", slug: "kids-lip-balm-set", category: "Skin Care", price: 400, stock: 30, description: "Fun, safe lip balms in kid-friendly flavours.", gender: "KIDS" },
    { name: "Shea Body Butter", slug: "shea-body-butter", category: "Body Care", price: 850, stock: 33, description: "Rich, fast-absorbing butter for soft, hydrated skin.", gender: "UNISEX" },
    { name: "Hydrating Face Mist", slug: "hydrating-face-mist", category: "Skin Care", price: 700, stock: 26, description: "Refreshing mist with aloe and rose water.", gender: "UNISEX" },
    { name: "Bridal Beauty Gift Set", slug: "bridal-gift-set", category: "Gift Sets", price: 4500, stock: 8, description: "Curated skincare and makeup set for the bride-to-be.", gender: "WOMEN" },
    { name: "Professional Makeup Brush Set", slug: "makeup-brush-set", category: "Beauty Tools", price: 1800, stock: 18, description: "12-piece brush set for flawless application.", gender: "UNISEX" },
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
