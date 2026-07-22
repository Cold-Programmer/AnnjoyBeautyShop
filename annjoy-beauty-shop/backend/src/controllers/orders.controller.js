"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.listMyOrders = listMyOrders;
exports.getOrderById = getOrderById;
exports.updateOrderStatus = updateOrderStatus;
const prisma_1 = require("../config/prisma");
const mpesa_service_1 = require("../services/mpesa.service");
const mpesa_config_1 = require("../config/mpesa.config");
const email_service_1 = require("../services/email.service");
const SHIPPING_FEE = 200;
/**
 * Creates an order priced from the DATABASE, never from client-submitted
 * prices, then triggers an M-Pesa STK push for the total. Order starts
 * PENDING and is marked PAID by the M-Pesa callback (see mpesa.controller).
 */
async function createOrder(req, res) {
    const { items, deliveryAddress, phone, guestEmail } = req.body;
    const productIds = items.map((i) => i.productId);
    const products = await prisma_1.prisma.product.findMany({ where: { id: { in: productIds }, isActive: true } });
    if (products.length !== productIds.length) {
        return res.status(400).json({ success: false, message: "One or more products are unavailable." });
    }
    for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (product.stock < item.quantity) {
            return res.status(409).json({ success: false, message: `Not enough stock for ${product.name}.` });
        }
    }
    const subtotal = items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        return sum + product.price * item.quantity;
    }, 0);
    const total = subtotal + SHIPPING_FEE;
    const order = await prisma_1.prisma.order.create({
        data: {
            userId: req.user?.userId,
            guestEmail: req.user ? undefined : guestEmail,
            guestPhone: req.user ? undefined : phone,
            deliveryAddress,
            subtotal,
            shipping: SHIPPING_FEE,
            total,
            items: {
                create: items.map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    return { productId: item.productId, quantity: item.quantity, price: product.price };
                }),
            },
        },
        include: { items: true },
    });
    if (!(0, mpesa_config_1.isMpesaConfigured)()) {
        return res.status(202).json({
            success: false,
            message: "Order created, but M-Pesa isn't configured on this server yet. See backend/README-MPESA.md.",
            orderId: order.id,
        });
    }
    try {
        const stk = await (0, mpesa_service_1.initiateStkPush)({
            phone,
            amount: total,
            accountReference: order.id.slice(0, 12),
            transactionDesc: "Annjoy Beauty order",
        });
        await prisma_1.prisma.order.update({ where: { id: order.id }, data: { mpesaCheckoutId: stk.CheckoutRequestID } });
        return res.status(201).json({
            success: true,
            message: "Check your phone and enter your M-Pesa PIN to complete payment.",
            orderId: order.id,
            checkoutRequestId: stk.CheckoutRequestID,
        });
    }
    catch (err) {
        // Order still exists as PENDING/unpaid — customer or admin can retry payment.
        return res.status(202).json({
            success: false,
            message: "Order created, but the payment prompt could not be sent. " + err.message,
            orderId: order.id,
        });
    }
}
async function listMyOrders(req, res) {
    if (!req.user)
        return res.status(401).json({ success: false, message: "Authentication required." });
    const orders = await prisma_1.prisma.order.findMany({
        where: { userId: req.user.userId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, orders });
}
async function getOrderById(req, res) {
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: req.params.id },
        include: { items: { include: { product: true } } },
    });
    if (!order)
        return res.status(404).json({ success: false, message: "Order not found." });
    res.json({ success: true, order });
}
async function updateOrderStatus(req, res) {
    const { status } = req.body;
    const order = await prisma_1.prisma.order.update({
        where: { id: req.params.id },
        data: { status },
        include: { user: true },
    });
    // Ask for feedback once an order is actually delivered — a well-defined,
    // one-time trigger (unlike trying to detect "the customer is done using
    // the app right now", which isn't reliably observable server-side).
    if (status === "DELIVERED" && !order.feedbackSentAt) {
        const email = order.user?.email || order.guestEmail;
        const firstName = order.user?.firstName || "there";
        if (email) {
            await (0, email_service_1.sendOrderFeedbackEmail)(email, firstName, order.id);
            await prisma_1.prisma.order.update({ where: { id: order.id }, data: { feedbackSentAt: new Date() } });
        }
    }
    res.json({ success: true, order });
}
