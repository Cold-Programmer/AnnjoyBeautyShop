"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(60).optional(),
    lastName: zod_1.z.string().min(1).max(60).optional(),
    phone: zod_1.z.string().min(9).max(15).optional(),
    avatarUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    title: zod_1.z.string().max(100).optional(),
    bio: zod_1.z.string().max(1000).optional(),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, "Current password is required"),
    newPassword: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
