import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function listProducts(req: Request, res: Response) {
  const { category, gender, search, sort = "newest", page = "1", limit = "20" } = req.query as Record<string, string>;
  const take = Math.min(Number(limit) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where = {
    isActive: true,
    ...(category ? { category: { slug: String(category) } } : {}),
    // UNISEX products always show up regardless of the selected gender
    // filter, so filtering by "Men" still surfaces unisex items rather
    // than hiding everything not explicitly tagged "MEN".
    ...(gender ? { OR: [{ gender: String(gender).toUpperCase() as any }, { gender: "UNISEX" as any }] } : {}),
    ...(search ? { name: { contains: String(search), mode: "insensitive" as const } } : {}),
  };

  const orderBy =
    sort === "price_asc" ? { price: "asc" as const } :
    sort === "price_desc" ? { price: "desc" as const } :
    { createdAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, take, skip, orderBy }),
    prisma.product.count({ where }),
  ]);

  res.json({ success: true, items, page: Number(page), limit: take, total, totalPages: Math.ceil(total / take) });
}

export async function getProductBySlug(req: Request, res: Response) {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: { category: true, reviews: { include: { user: { select: { firstName: true, lastName: true } } } } },
  });
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });
  res.json({ success: true, product });
}

export async function createProduct(req: Request, res: Response) {
  const product = await prisma.product.create({ data: req.body });
  res.status(201).json({ success: true, product });
}

export async function updateProduct(req: Request, res: Response) {
  const product = await prisma.product.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, product });
}

export async function deleteProduct(req: Request, res: Response) {
  await prisma.product.update({ where: { id: req.params.id }, data: { isActive: false } });
  res.json({ success: true, message: "Product deactivated." });
}
