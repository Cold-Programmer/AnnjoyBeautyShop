import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  stkPushHandler,
  stkCallbackHandler,
  stkTimeoutHandler,
  paymentStatusHandler,
} from "../controllers/mpesa.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

// Tighter than the global limiter — payment triggers are a classic abuse
// target (spamming STK pushes to someone else's phone is a real nuisance
// vector), so cap it harder: 10 attempts per 10 minutes per IP.
const paymentLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });

// Called by your frontend (checkout / booking page) — must be logged in,
// per the site-wide "no page/action without an account" policy.
router.post("/stkpush", requireAuth, paymentLimiter, asyncHandler(stkPushHandler));

// Called BY SAFARICOM — must stay public HTTPS, no auth middleware in
// front of it, or Daraja's callback will never reach it.
router.post("/callback", asyncHandler(stkCallbackHandler));
router.post("/timeout", asyncHandler(stkTimeoutHandler));

// Called by your frontend to poll for the result
router.get("/status/:checkoutRequestId", requireAuth, asyncHandler(paymentStatusHandler));

export default router;
