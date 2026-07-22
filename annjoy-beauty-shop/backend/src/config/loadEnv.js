"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
/**
 * Loads backend/.env AND expands ${VAR} references inside it (e.g.
 * MPESA_STK_CALLBACK_URL=${BASE_URL}/api/mpesa/callback).
 *
 * Plain `dotenv.config()` does NOT do this substitution — it treats
 * "${BASE_URL}/api/mpesa/callback" as a literal string, so
 * MPESA_STK_CALLBACK_URL ended up pointing at a URL that literally
 * contained the text "${BASE_URL}" instead of your real domain. That
 * silently broke M-Pesa configuration even when every value in .env
 * *looked* correct. dotenv-expand fixes this at the source, once, here —
 * every other config file imports THIS module instead of calling
 * dotenv.config() itself, so there's exactly one place this happens.
 */
const result = dotenv_1.default.config();
dotenv_expand_1.default.expand(result);
