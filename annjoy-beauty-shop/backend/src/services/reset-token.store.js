"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTokenStore = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Minimal in-memory store for password-reset tokens, mirroring
 * transaction.store.ts. Swap for a DB-backed table (with a hashed token
 * column, same pattern as RefreshToken) before going to production so
 * tokens survive a server restart.
 */
class ResetTokenStore {
    constructor() {
        this.tokens = new Map();
    }
    create(userId) {
        const token = crypto_1.default.randomBytes(32).toString("hex");
        this.tokens.set(token, { userId, expiresAt: Date.now() + 60 * 60 * 1000 }); // 1 hour
        return token;
    }
    consume(token) {
        const record = this.tokens.get(token);
        if (!record || record.expiresAt < Date.now())
            return null;
        this.tokens.delete(token); // one-time use
        return record.userId;
    }
}
exports.resetTokenStore = new ResetTokenStore();
