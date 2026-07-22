"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = exports.createAppointmentSchema = void 0;
const zod_1 = require("zod");
exports.createAppointmentSchema = zod_1.z.object({
    serviceId: zod_1.z.string().min(1, "Service is required"),
    stylistId: zod_1.z.string().optional(),
    date: zod_1.z.string().refine((d) => !isNaN(Date.parse(d)), "Enter a valid date"),
    timeSlot: zod_1.z.string().min(1, "Time slot is required"),
    notes: zod_1.z.string().max(500).optional(),
});
exports.createOrderSchema = zod_1.z.object({
    items: zod_1.z
        .array(zod_1.z.object({ productId: zod_1.z.string(), quantity: zod_1.z.number().int().positive() }))
        .min(1, "Cart cannot be empty"),
    deliveryAddress: zod_1.z.string().min(3, "Delivery address is required"),
    phone: zod_1.z.string().min(9, "Enter a valid phone number"),
    guestEmail: zod_1.z.string().email().optional(),
});
