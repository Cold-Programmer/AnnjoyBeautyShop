"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMpesaConfig = getMpesaConfig;
exports.isMpesaConfigured = isMpesaConfigured;
require("./loadEnv");
function required(name) {
    const value = process.env[name];
    if (!value || value.trim() === "" || value.includes("YOUR-")) {
        throw new Error(`M-Pesa is not configured: "${name}" is missing or still a placeholder in your .env file. ` +
            `Copy backend/.env.example to backend/.env and fill in your Daraja credentials.`);
    }
    return value;
}
/**
 * Lazily reads + validates M-Pesa env vars on first use, instead of at
 * module import time. This means a missing/placeholder M-Pesa key only
 * breaks M-Pesa endpoints (with a clear error message) — it can no
 * longer crash the entire server at boot and take down unrelated
 * features like auth, services, products, and appointments.
 */
let cached = null;
function getMpesaConfig() {
    if (cached)
        return cached;
    cached = {
        env: process.env.MPESA_ENV || "sandbox",
        baseUrl: required("MPESA_BASE_URL"),
        consumerKey: required("MPESA_CONSUMER_KEY"),
        consumerSecret: required("MPESA_CONSUMER_SECRET"),
        shortcode: required("MPESA_SHORTCODE"),
        passkey: required("MPESA_PASSKEY"),
        callbackUrl: required("MPESA_STK_CALLBACK_URL"),
        timeoutUrl: required("MPESA_TIMEOUT_URL"),
        transactionType: process.env.MPESA_TRANSACTION_TYPE || "CustomerPayBillOnline",
        tillNumber: process.env.MPESA_TILL_NUMBER || undefined,
    };
    return cached;
}
/** True if M-Pesa env vars look configured, without throwing. Use this to
 * show a friendly "payments not configured" response instead of a 500. */
function isMpesaConfigured() {
    try {
        getMpesaConfig();
        return true;
    }
    catch (err) {
        // Previously silent — this is exactly why "M-Pesa isn't configured"
        // was confusing to debug even with a filled-in .env. Now the real
        // reason prints to the backend terminal every time this check fails.
        console.error(`[mpesa.config] ${err.message}`);
        return false;
    }
}
