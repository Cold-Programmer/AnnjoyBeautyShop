"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const mpesa_controller_1 = require("../controllers/mpesa.controller");
const auth_1 = require("../middleware/auth");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
// Tighter than the global limiter — payment triggers are a classic abuse
// target (spamming STK pushes to someone else's phone is a real nuisance
// vector), so cap it harder: 10 attempts per 10 minutes per IP.
const paymentLimiter = (0, express_rate_limit_1.default)({ windowMs: 10 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });
// Called by your frontend (checkout / booking page) — must be logged in,
// per the site-wide "no page/action without an account" policy.
router.post("/stkpush", auth_1.requireAuth, paymentLimiter, (0, asyncHandler_1.asyncHandler)(mpesa_controller_1.stkPushHandler));
// Called BY SAFARICOM — must stay public HTTPS, no auth middleware in
// front of it, or Daraja's callback will never reach it.
router.post("/callback", (0, asyncHandler_1.asyncHandler)(mpesa_controller_1.stkCallbackHandler));
router.post("/timeout", (0, asyncHandler_1.asyncHandler)(mpesa_controller_1.stkTimeoutHandler));
// Called by your frontend to poll for the result
router.get("/status/:checkoutRequestId", auth_1.requireAuth, (0, asyncHandler_1.asyncHandler)(mpesa_controller_1.paymentStatusHandler));
exports.default = router;
