"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerificationSchema = exports.verifyEmailSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.changePasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, "First name is required").max(60),
    lastName: zod_1.z.string().min(1, "Last name is required").max(60),
    email: zod_1.z.string().email("Enter a valid email address"),
    phone: zod_1.z.string().min(9, "Enter a valid phone number").max(15),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Enter a valid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Enter a valid email address"),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Reset token is required"),
    newPassword: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
exports.verifyEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email("Enter a valid email address"),
    code: zod_1.z.string().length(6, "Enter the 6-digit code"),
});
exports.resendVerificationSchema = zod_1.z.object({
    email: zod_1.z.string().email("Enter a valid email address"),
});
