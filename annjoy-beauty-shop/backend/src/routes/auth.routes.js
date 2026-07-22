"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_controller_1 = require("../controllers/auth.controller");
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const auth_validators_1 = require("../validators/auth.validators");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
// Tighter limit on auth endpoints specifically — brute force protection.
const authLimiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
router.post("/register", authLimiter, (0, validate_1.validateBody)(auth_validators_1.registerSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.register));
router.post("/verify-email", authLimiter, (0, validate_1.validateBody)(auth_validators_1.verifyEmailSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.verifyEmail));
router.post("/resend-verification", authLimiter, (0, validate_1.validateBody)(auth_validators_1.resendVerificationSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.resendVerification));
router.post("/login", authLimiter, (0, validate_1.validateBody)(auth_validators_1.loginSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.login));
router.post("/forgot-password", authLimiter, (0, validate_1.validateBody)(auth_validators_1.forgotPasswordSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.forgotPassword));
router.post("/reset-password", authLimiter, (0, validate_1.validateBody)(auth_validators_1.resetPasswordSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.resetPassword));
router.post("/refresh", (0, asyncHandler_1.asyncHandler)(auth_controller_1.refresh));
router.post("/logout", (0, asyncHandler_1.asyncHandler)(auth_controller_1.logout));
router.post("/logout-all", auth_1.requireAuth, (0, asyncHandler_1.asyncHandler)(auth_controller_1.logoutAllDevices));
router.get("/me", auth_1.requireAuth, (0, asyncHandler_1.asyncHandler)(auth_controller_1.me));
exports.default = router;
