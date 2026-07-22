"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.getProductBySlug = getProductBySlug;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const prisma_1 = require("../config/prisma");
async function listProducts(req, res) {
    const { category, gender, search, sort = "newest", page = "1", limit = "20" } = req.query;
    const take = Math.min(Number(limit) || 20, 100);
    const skip = (Math.max(Number(page) || 1, 1) - 1) * take;
    const where = {
        isActive: true,
        ...(category ? { category: { slug: String(category) } } : {}),
        // UNISEX products always show up regardless of the selected gender
        // filter, so filtering by "Men" still surfaces unisex items rather
        // than hiding everything not explicitly tagged "MEN".
        ...(gender ? { OR: [{ gender: String(gender).toUpperCase() }, { gender: "UNISEX" }] } : {}),
        ...(search ? { name: { contains: String(search), mode: "insensitive" } } : {}),
    };
    const orderBy = sort === "price_asc" ? { price: "asc" } :
        sort === "price_desc" ? { price: "desc" } :
            { createdAt: "desc" };
    const [items, total] = await Promise.all([
        prisma_1.prisma.product.findMany({ where, include: { category: true }, take, skip, orderBy }),
        prisma_1.prisma.product.count({ where }),
    ]);
    res.json({ success: true, items, page: Number(page), limit: take, total, totalPages: Math.ceil(total / take) });
}
async function getProductBySlug(req, res) {
    const product = await prisma_1.prisma.product.findUnique({
        where: { slug: req.params.slug },
        include: { category: true, reviews: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });
    if (!product)
        return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, product });
}
async function createProduct(req, res) {
    const product = await prisma_1.prisma.product.create({ data: req.body });
    res.status(201).json({ success: true, product });
}
async function updateProduct(req, res) {
    const product = await prisma_1.prisma.product.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, product });
}
async function deleteProduct(req, res) {
    await prisma_1.prisma.product.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true, message: "Product deactivated." });
}
