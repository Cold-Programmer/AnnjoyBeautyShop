"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stkPushHandler = stkPushHandler;
exports.stkCallbackHandler = stkCallbackHandler;
exports.stkTimeoutHandler = stkTimeoutHandler;
exports.paymentStatusHandler = paymentStatusHandler;
const mpesa_service_1 = require("../services/mpesa.service");
const mpesa_config_1 = require("../config/mpesa.config");
const transaction_store_1 = require("../services/transaction.store");
const prisma_1 = require("../config/prisma");
const email_service_1 = require("../services/email.service");
/**
 * POST /api/mpesa/stkpush
 * Triggers the "Enter your M-Pesa PIN" prompt on the customer's phone.
 */
async function stkPushHandler(req, res) {
    if (!(0, mpesa_config_1.isMpesaConfigured)()) {
        return res.status(503).json({
            success: false,
            message: "M-Pesa isn't configured on this server yet. Set MPESA_* variables in backend/.env (see backend/README-MPESA.md).",
        });
    }
    try {
        const { phone, amount, accountReference, transactionDesc } = req.body;
        if (!phone || !amount || !accountReference) {
            return res.status(400).json({
                success: false,
                message: "phone, amount, and accountReference are required.",
            });
        }
        const result = await (0, mpesa_service_1.initiateStkPush)({
            phone,
            amount,
            accountReference,
            transactionDesc: transactionDesc || "Annjoy Beauty Shop",
        });
        if (result.ResponseCode !== "0") {
            return res.status(422).json({
                success: false,
                message: result.ResponseDescription || "Payment prompt could not be sent.",
            });
        }
        transaction_store_1.transactionStore.create({
            checkoutRequestId: result.CheckoutRequestID,
            merchantRequestId: result.MerchantRequestID,
            accountReference,
            amount: Number(amount),
            phone,
        });
        // Frontend should start polling GET /api/mpesa/status/:checkoutRequestId
        return res.status(200).json({
            success: true,
            message: "Check your phone and enter your M-Pesa PIN to complete payment.",
            checkoutRequestId: result.CheckoutRequestID,
            merchantRequestId: result.MerchantRequestID,
        });
    }
    catch (err) {
        console.error("[mpesa.controller] stkPushHandler error:", err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
}
/**
 * POST /api/mpesa/callback
 *
 * ⚠️ THIS IS THE FIX FOR YOUR 502 ERROR.
 * Safaricom expects a fast 200 response (it will retry / the gateway will
 * mark the request as failed if you take too long or throw). So we:
 *   1. ACK immediately with 200 + the exact body Safaricom expects.
 *   2. Process the actual business logic afterwards, wrapped in try/catch
 *      so nothing here can crash the process or hang the response.
 */
async function stkCallbackHandler(req, res) {
    // 1. Acknowledge immediately — do this before anything else.
    res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    // 2. Process asynchronously — errors here must never throw uncaught.
    try {
        const body = req.body;
        const callback = body?.Body?.stkCallback;
        if (!callback) {
            console.warn("[mpesa.callback] Received malformed callback payload:", req.body);
            return;
        }
        const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback;
        if (ResultCode === 0) {
            const items = CallbackMetadata?.Item || [];
            const get = (name) => items.find((i) => i.Name === name)?.Value;
            const mpesaReceiptNumber = String(get("MpesaReceiptNumber") ?? "");
            const amountPaid = get("Amount");
            const payerPhone = get("PhoneNumber");
            transaction_store_1.transactionStore.updateStatus(CheckoutRequestID, "SUCCESS", {
                mpesaReceiptNumber,
                resultDesc: ResultDesc,
            });
            console.log(`[mpesa.callback] Payment SUCCESS for ${CheckoutRequestID} — receipt ${mpesaReceiptNumber}`);
            const order = await prisma_1.prisma.order.findUnique({
                where: { mpesaCheckoutId: CheckoutRequestID },
                include: { items: true, user: true },
            });
            if (order) {
                await prisma_1.prisma.$transaction([
                    prisma_1.prisma.order.update({
                        where: { id: order.id },
                        data: { paymentStatus: "SUCCESS", status: "PAID", mpesaReceiptNo: mpesaReceiptNumber },
                    }),
                    ...order.items.map((item) => prisma_1.prisma.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    })),
                ]);
                // Customer confirmation + admin payment notification.
                //
                // Real M-Pesa Till/Paybill payments also trigger Safaricom's own
                // native SMS to the till owner's registered phone automatically
                // once this is running in PRODUCTION with a real till — that part
                // is entirely Safaricom's infrastructure, not something this app
                // triggers or can simulate in sandbox. This email is the
                // in-app equivalent so the admin has a record either way.
                const customerEmail = order.user?.email || order.guestEmail;
                if (customerEmail) {
                    await (0, email_service_1.sendEmail)({
                        to: customerEmail,
                        subject: "Payment received — GLOW 'N' GO order confirmed",
                        text: `Your payment of KES ${amountPaid} was received (M-Pesa receipt ${mpesaReceiptNumber}). Order ${order.id} is now confirmed.`,
                        html: `<div style="font-family:sans-serif;max-width:480px;margin:auto">
              <h2 style="color:#B76E79">Payment received ✓</h2>
              <p>KES ${amountPaid} received — M-Pesa receipt <strong>${mpesaReceiptNumber}</strong>.</p>
              <p>Order <strong>${order.id}</strong> is now confirmed and being prepared.</p>
            </div>`,
                    });
                }
                if (process.env.ADMIN_NOTIFICATION_EMAIL) {
                    await (0, email_service_1.sendEmail)({
                        to: process.env.ADMIN_NOTIFICATION_EMAIL,
                        subject: `Payment received — KES ${amountPaid} (${mpesaReceiptNumber})`,
                        text: `Order ${order.id} paid. KES ${amountPaid} from ${payerPhone}. Receipt: ${mpesaReceiptNumber}.`,
                        html: `<p>Order <strong>${order.id}</strong> paid — KES ${amountPaid} from ${payerPhone}.</p><p>Receipt: ${mpesaReceiptNumber}</p>`,
                    });
                }
            }
        }
        else {
            // 1032 = user cancelled, 1037 = timeout, etc.
            const status = ResultCode === 1032 ? "CANCELLED" : "FAILED";
            transaction_store_1.transactionStore.updateStatus(CheckoutRequestID, status, { resultDesc: ResultDesc });
            console.log(`[mpesa.callback] Payment ${status} for ${CheckoutRequestID}: ${ResultDesc}`);
            await prisma_1.prisma.order.updateMany({
                where: { mpesaCheckoutId: CheckoutRequestID },
                data: { paymentStatus: status === "CANCELLED" ? "CANCELLED" : "FAILED" },
            });
        }
    }
    catch (err) {
        // Never let this bubble up — the response was already sent.
        console.error("[mpesa.callback] Error processing callback:", err.message);
    }
}
/**
 * POST /api/mpesa/timeout
 * Safaricom calls this if the transaction times out server-side.
 */
async function stkTimeoutHandler(req, res) {
    res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    console.warn("[mpesa.timeout] Timeout callback received:", JSON.stringify(req.body));
}
/**
 * GET /api/mpesa/status/:checkoutRequestId
 * Frontend polls this after showing "Check your phone..." to know when to
 * redirect to a success/failure screen.
 */
async function paymentStatusHandler(req, res) {
    const { checkoutRequestId } = req.params;
    const record = transaction_store_1.transactionStore.get(checkoutRequestId);
    if (!record) {
        return res.status(404).json({ success: false, message: "Transaction not found." });
    }
    // If still pending after a few seconds, optionally double-check with Safaricom directly
    if (record.status === "PENDING" && req.query.forceCheck === "true") {
        try {
            const liveStatus = await (0, mpesa_service_1.queryStkStatus)(checkoutRequestId);
            return res.json({ success: true, ...record, liveStatus });
        }
        catch {
            // fall through to cached status if the live query itself fails
        }
    }
    return res.json({ success: true, ...record });
}
