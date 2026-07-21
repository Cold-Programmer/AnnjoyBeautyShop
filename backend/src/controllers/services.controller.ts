import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function listServices(req: Request, res: Response) {
  const { category, page = "1", limit = "20" } = req.query as Record<string, string>;
  const take = Math.min(Number(limit) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where = {
    isActive: true,
    ...(category ? { category: { slug: String(category) } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.service.findMany({ where, include: { category: true }, take, skip, orderBy: { name: "asc" } }),
    prisma.service.count({ where }),
  ]);

  res.json({ success: true, items, page: Number(page), limit: take, total, totalPages: Math.ceil(total / take) });
}

export async function getServiceBySlug(req: Request, res: Response) {
  const service = await prisma.service.findUnique({ where: { slug: req.params.slug }, include: { category: true } });
  if (!service) return res.status(404).json({ success: false, message: "Service not found." });
  res.json({ success: true, service });
}

export async function createService(req: Request, res: Response) {
  const { name, slug, description, price, durationMins, categoryId, imageUrl } = req.body;
  const service = await prisma.service.create({
    data: { name, slug, description, price, durationMins, categoryId, imageUrl },
  });
  res.status(201).json({ success: true, service });
}

export async function updateService(req: Request, res: Response) {
  const service = await prisma.service.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, service });
}

export async function deleteService(req: Request, res: Response) {
  await prisma.service.update({ where: { id: req.params.id }, data: { isActive: false } });
  res.json({ success: true, message: "Service deactivated." });
}
