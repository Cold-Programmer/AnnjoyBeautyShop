"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhone = normalizePhone;
exports.initiateStkPush = initiateStkPush;
exports.queryStkStatus = queryStkStatus;
const axios_1 = __importDefault(require("axios"));
const mpesa_config_1 = require("../config/mpesa.config");
// Built lazily (per-call) from getMpesaConfig() rather than at module load,
// so importing this file never throws just because M-Pesa env vars aren't
// set yet — only actually calling one of these functions does.
function client() {
    const config = (0, mpesa_config_1.getMpesaConfig)();
    return {
        config,
        http: axios_1.default.create({ baseURL: config.baseUrl, timeout: 15000 }),
    };
}
// --- Access token caching (tokens are valid ~1 hour) ---
let cachedToken = null;
async function getAccessToken() {
    if (cachedToken && Date.now() < cachedToken.expiresAt) {
        return cachedToken.value;
    }
    const { config, http } = client();
    const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
    try {
        const { data } = await http.get("/oauth/v1/generate", {
            params: { grant_type: "client_credentials" },
            headers: { Authorization: `Basic ${auth}` },
        });
        cachedToken = {
            value: data.access_token,
            expiresAt: Date.now() + (Number(data.expires_in) - 60) * 1000,
        };
        return cachedToken.value;
    }
    catch (err) {
        console.error("[mpesa] Failed to get access token:", err?.response?.data || err.message);
        throw new Error("Unable to authenticate with M-Pesa. Check consumer key/secret.");
    }
}
/**
 * Normalizes Kenyan phone numbers to the 2547XXXXXXXX / 2541XXXXXXXX format
 * M-Pesa requires. Accepts 07..., +2547..., 2547..., 254 7...
 */
function normalizePhone(rawPhone) {
    let phone = rawPhone.replace(/\s+/g, "").replace(/^\+/, "");
    if (phone.startsWith("0")) {
        phone = "254" + phone.slice(1);
    }
    else if (phone.startsWith("7") || phone.startsWith("1")) {
        phone = "254" + phone;
    }
    if (!/^254(7|1)\d{8}$/.test(phone)) {
        throw new Error(`Invalid Kenyan phone number: "${rawPhone}"`);
    }
    return phone;
}
function generateTimestamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return (d.getFullYear().toString() +
        pad(d.getMonth() + 1) +
        pad(d.getDate()) +
        pad(d.getHours()) +
        pad(d.getMinutes()) +
        pad(d.getSeconds()));
}
/**
 * Initiates an STK Push ("Lipa Na M-Pesa Online") — this is what sends
 * the payment prompt to the customer's phone.
 */
async function initiateStkPush(body) {
    const { phone, amount, accountReference, transactionDesc } = body;
    if (!amount || amount <= 0) {
        throw new Error("Amount must be a positive number.");
    }
    const { config, http } = client();
    const normalizedPhone = normalizePhone(phone);
    const token = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString("base64");
    const payload = {
        BusinessShortCode: config.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: config.transactionType,
        Amount: Math.round(amount),
        PartyA: normalizedPhone,
        // In production Buy-Goods mode this should be your real Till number
        // (MPESA_TILL_NUMBER); Daraja's sandbox ignores it and always routes
        // to the shared sandbox till regardless — see mpesa.config.ts and
        // README-MPESA.md for the sandbox-vs-production distinction.
        PartyB: config.tillNumber || config.shortcode,
        PhoneNumber: normalizedPhone,
        CallBackURL: config.callbackUrl,
        AccountReference: accountReference.slice(0, 12),
        TransactionDesc: transactionDesc.slice(0, 13),
    };
    try {
        const { data } = await http.post("/mpesa/stkpush/v1/processrequest", payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    }
    catch (err) {
        console.error("[mpesa] STK push failed:", err?.response?.data || err.message);
        throw new Error(err?.response?.data?.errorMessage || "Failed to initiate M-Pesa payment prompt. Please try again.");
    }
}
/**
 * Query the status of an STK push directly from Safaricom, useful as a
 * fallback if the callback is delayed or the phone was unreachable.
 */
async function queryStkStatus(checkoutRequestId) {
    const { config, http } = client();
    const token = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString("base64");
    const { data } = await http.post("/mpesa/stkpushquery/v1/query", {
        BusinessShortCode: config.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
    }, { headers: { Authorization: `Bearer ${token}` } });
    return data;
}
