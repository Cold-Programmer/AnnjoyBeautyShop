"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusSchema = exports.updateRoleSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(60),
    lastName: zod_1.z.string().min(1).max(60),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(9).max(15),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(["CUSTOMER", "STYLIST", "STAFF", "ADMIN"]),
    title: zod_1.z.string().max(100).optional(),
    bio: zod_1.z.string().max(1000).optional(),
});
exports.updateRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(["CUSTOMER", "STYLIST", "STAFF", "ADMIN"]),
});
exports.updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["ACTIVE", "SUSPENDED", "FLAGGED", "DELETED"]),
    reason: zod_1.z.string().max(500).optional(),
});
