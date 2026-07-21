import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  register, login, refresh, logout, logoutAllDevices, me,
  forgotPassword, resetPassword, verifyEmail, resendVerification,
} from "../controllers/auth.controller";
import { validateBody } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import {
  registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema,
  verifyEmailSchema, resendVerificationSchema,
} from "../validators/auth.validators";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

// Tighter limit on auth endpoints specifically — brute force protection.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

router.post("/register", authLimiter, validateBody(registerSchema), asyncHandler(register));
router.post("/verify-email", authLimiter, validateBody(verifyEmailSchema), asyncHandler(verifyEmail));
router.post("/resend-verification", authLimiter, validateBody(resendVerificationSchema), asyncHandler(resendVerification));
router.post("/login", authLimiter, validateBody(loginSchema), asyncHandler(login));
router.post("/forgot-password", authLimiter, validateBody(forgotPasswordSchema), asyncHandler(forgotPassword));
router.post("/reset-password", authLimiter, validateBody(resetPasswordSchema), asyncHandler(resetPassword));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));
router.post("/logout-all", requireAuth, asyncHandler(logoutAllDevices));
router.get("/me", requireAuth, asyncHandler(me));

export default router;
