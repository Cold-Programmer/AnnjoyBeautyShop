"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.signAccessToken = signAccessToken;
exports.verifyAccessToken = verifyAccessToken;
exports.issueRefreshToken = issueRefreshToken;
exports.rotateRefreshToken = rotateRefreshToken;
exports.revokeRefreshToken = revokeRefreshToken;
exports.revokeAllUserSessions = revokeAllUserSessions;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../config/prisma");
const env_1 = require("../config/env");
const SALT_ROUNDS = 12;
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwtAccessSecret, { expiresIn: env_1.env.accessTokenTtl });
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.jwtAccessSecret);
}
/**
 * Refresh tokens are opaque random strings stored (hashed) in the DB,
 * not JWTs — this lets us revoke individual sessions ("logout from all
 * devices") without needing a blocklist.
 */
async function issueRefreshToken(userId) {
    const token = crypto_1.default.randomBytes(48).toString("hex");
    const expiresAt = new Date(Date.now() + env_1.env.refreshTokenTtlDays * 24 * 60 * 60 * 1000);
    await prisma_1.prisma.refreshToken.create({
        data: { token: hashToken(token), userId, expiresAt },
    });
    return token; // raw token goes to the client cookie; only the hash is stored
}
async function rotateRefreshToken(oldToken) {
    const hashed = hashToken(oldToken);
    const record = await prisma_1.prisma.refreshToken.findUnique({ where: { token: hashed } });
    if (!record || record.expiresAt < new Date())
        return null;
    await prisma_1.prisma.refreshToken.delete({ where: { id: record.id } });
    const newToken = await issueRefreshToken(record.userId);
    return { userId: record.userId, newToken };
}
async function revokeRefreshToken(token) {
    await prisma_1.prisma.refreshToken.deleteMany({ where: { token: hashToken(token) } });
}
async function revokeAllUserSessions(userId) {
    await prisma_1.prisma.refreshToken.deleteMany({ where: { userId } });
}
function hashToken(token) {
    return crypto_1.default.createHash("sha256").update(token).digest("hex");
}
