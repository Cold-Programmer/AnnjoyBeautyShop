"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listServices = listServices;
exports.getServiceBySlug = getServiceBySlug;
exports.createService = createService;
exports.updateService = updateService;
exports.deleteService = deleteService;
const prisma_1 = require("../config/prisma");
async function listServices(req, res) {
    const { category, page = "1", limit = "20" } = req.query;
    const take = Math.min(Number(limit) || 20, 100);
    const skip = (Math.max(Number(page) || 1, 1) - 1) * take;
    const where = {
        isActive: true,
        ...(category ? { category: { slug: String(category) } } : {}),
    };
    const [items, total] = await Promise.all([
        prisma_1.prisma.service.findMany({ where, include: { category: true }, take, skip, orderBy: { name: "asc" } }),
        prisma_1.prisma.service.count({ where }),
    ]);
    res.json({ success: true, items, page: Number(page), limit: take, total, totalPages: Math.ceil(total / take) });
}
async function getServiceBySlug(req, res) {
    const service = await prisma_1.prisma.service.findUnique({ where: { slug: req.params.slug }, include: { category: true } });
    if (!service)
        return res.status(404).json({ success: false, message: "Service not found." });
    res.json({ success: true, service });
}
async function createService(req, res) {
    const { name, slug, description, price, durationMins, categoryId, imageUrl } = req.body;
    const service = await prisma_1.prisma.service.create({
        data: { name, slug, description, price, durationMins, categoryId, imageUrl },
    });
    res.status(201).json({ success: true, service });
}
async function updateService(req, res) {
    const service = await prisma_1.prisma.service.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, service });
}
async function deleteService(req, res) {
    await prisma_1.prisma.service.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true, message: "Service deactivated." });
}
