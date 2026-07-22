"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.verifyEmail = verifyEmail;
exports.resendVerification = resendVerification;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
exports.logoutAllDevices = logoutAllDevices;
exports.me = me;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../config/prisma");
const env_1 = require("../config/env");
const auth_service_1 = require("../services/auth.service");
const reset_token_store_1 = require("../services/reset-token.store");
const email_service_1 = require("../services/email.service");
const activity_service_1 = require("../services/activity.service");
const cookieOpts = {
    httpOnly: true,
    secure: env_1.env.cookieSecure,
    sameSite: "lax",
    path: "/",
};
function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie("accessToken", accessToken, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...cookieOpts, maxAge: env_1.env.refreshTokenTtlDays * 24 * 60 * 60 * 1000 });
}
function generateOtp() {
    return String(crypto_1.default.randomInt(100000, 999999)); // 6-digit code
}
function publicUser(user) {
    return { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, emailVerified: user.emailVerified };
}
async function register(req, res) {
    const { firstName, lastName, email, phone, password } = req.body;
    const existing = await prisma_1.prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
    if (existing) {
        return res.status(409).json({ success: false, message: "An account with that email or phone already exists." });
    }
    const passwordHash = await (0, auth_service_1.hashPassword)(password);
    const verificationCode = generateOtp();
    const user = await prisma_1.prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            phone,
            passwordHash,
            verificationCode,
            verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
    });
    await (0, email_service_1.sendVerificationEmail)(email, firstName, verificationCode);
    await (0, activity_service_1.logActivity)({ userId: user.id, type: "REGISTER", ipAddress: req.ip, userAgent: req.headers["user-agent"] });
    // No auth cookies are set yet — the account can't log in until the
    // code is verified (see login()'s emailVerified check below).
    return res.status(201).json({
        success: true,
        message: "Account created. Check your email for a 6-digit verification code to finish signing up.",
        user: publicUser(user),
    });
}
async function verifyEmail(req, res) {
    const { email, code } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user ||
        !user.verificationCode ||
        user.verificationCode !== code ||
        !user.verificationCodeExpiresAt ||
        user.verificationCodeExpiresAt < new Date()) {
        return res.status(400).json({ success: false, message: "That code is incorrect or has expired." });
    }
    const verified = await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true, verificationCode: null, verificationCodeExpiresAt: null },
    });
    const accessToken = (0, auth_service_1.signAccessToken)({ userId: verified.id, role: verified.role });
    const refreshToken = await (0, auth_service_1.issueRefreshToken)(verified.id);
    setAuthCookies(res, accessToken, refreshToken);
    return res.json({ success: true, message: "Email verified — you're all set.", user: publicUser(verified) });
}
async function resendVerification(req, res) {
    const { email } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (user && !user.emailVerified) {
        const verificationCode = generateOtp();
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { verificationCode, verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000) },
        });
        await (0, email_service_1.sendVerificationEmail)(email, user.firstName, verificationCode);
    }
    // Same response whether or not the account exists / is already verified.
    return res.json({ success: true, message: "If that account needs verifying, a new code has been sent." });
}
async function login(req, res) {
    const { email, password } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user || !(await (0, auth_service_1.verifyPassword)(password, user.passwordHash))) {
        await (0, activity_service_1.logActivity)({ type: "LOGIN_FAILED", metadata: { email }, ipAddress: req.ip, userAgent: req.headers["user-agent"] });
        return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    if (user.status !== "ACTIVE") {
        return res.status(403).json({
            success: false,
            message: user.status === "SUSPENDED"
                ? "Your account has been suspended. Contact support if you believe this is a mistake."
                : user.status === "FLAGGED"
                    ? "Your account is under security review and temporarily restricted."
                    : "This account no longer has access.",
        });
    }
    if (!user.emailVerified) {
        return res.status(403).json({
            success: false,
            code: "EMAIL_NOT_VERIFIED",
            message: "Please verify your email before logging in. Check your inbox for the code, or request a new one.",
        });
    }
    const accessToken = (0, auth_service_1.signAccessToken)({ userId: user.id, role: user.role });
    const refreshToken = await (0, auth_service_1.issueRefreshToken)(user.id);
    setAuthCookies(res, accessToken, refreshToken);
    await prisma_1.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date(), lastSeenAt: new Date() } });
    await (0, activity_service_1.logActivity)({ userId: user.id, type: "LOGIN", ipAddress: req.ip, userAgent: req.headers["user-agent"] });
    return res.json({ success: true, user: publicUser(user) });
}
async function refresh(req, res) {
    const token = req.cookies?.refreshToken;
    if (!token)
        return res.status(401).json({ success: false, message: "No refresh token." });
    const result = await (0, auth_service_1.rotateRefreshToken)(token);
    if (!result) {
        res.clearCookie("accessToken", cookieOpts);
        res.clearCookie("refreshToken", cookieOpts);
        return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { id: result.userId } });
    if (!user || user.status !== "ACTIVE") {
        return res.status(401).json({ success: false, message: "Session expired." });
    }
    const accessToken = (0, auth_service_1.signAccessToken)({ userId: user.id, role: user.role });
    setAuthCookies(res, accessToken, result.newToken);
    return res.json({ success: true });
}
async function logout(req, res) {
    const token = req.cookies?.refreshToken;
    if (token)
        await (0, auth_service_1.revokeRefreshToken)(token);
    if (req.user)
        await (0, activity_service_1.logActivity)({ userId: req.user.userId, type: "LOGOUT" });
    res.clearCookie("accessToken", cookieOpts);
    res.clearCookie("refreshToken", cookieOpts);
    return res.json({ success: true, message: "Logged out." });
}
async function logoutAllDevices(req, res) {
    if (!req.user)
        return res.status(401).json({ success: false, message: "Authentication required." });
    await (0, auth_service_1.revokeAllUserSessions)(req.user.userId);
    res.clearCookie("accessToken", cookieOpts);
    res.clearCookie("refreshToken", cookieOpts);
    return res.json({ success: true, message: "Logged out from all devices." });
}
async function me(req, res) {
    if (!req.user)
        return res.status(401).json({ success: false, message: "Authentication required." });
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
            id: true, firstName: true, lastName: true, email: true, phone: true, role: true,
            avatarUrl: true, title: true, bio: true, emailVerified: true, createdAt: true,
        },
    });
    if (!user)
        return res.status(404).json({ success: false, message: "User not found." });
    return res.json({ success: true, user });
}
async function forgotPassword(req, res) {
    const { email } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (user) {
        const token = reset_token_store_1.resetTokenStore.create(user.id);
        const resetUrl = `${env_1.env.corsOrigin}/reset-password?token=${token}`;
        await (0, email_service_1.sendEmail)({
            to: email,
            subject: "Reset your GLOW 'N' GO password",
            text: `Hi ${user.firstName},\n\nReset your password here: ${resetUrl}\nThis link expires in 1 hour.`,
            html: `<div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#B76E79">Reset your password</h2>
        <p>Hi ${user.firstName},</p>
        <p><a href="${resetUrl}" style="background:#B76E79;color:#fff;padding:10px 20px;border-radius:24px;text-decoration:none">Reset password</a></p>
        <p style="color:#666">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>`,
        });
        await (0, activity_service_1.logActivity)({ userId: user.id, type: "PASSWORD_RESET", metadata: { stage: "requested" } });
    }
    return res.json({
        success: true,
        message: "If an account exists for that email, we've sent a password reset link.",
    });
}
async function resetPassword(req, res) {
    const { token, newPassword } = req.body;
    const userId = reset_token_store_1.resetTokenStore.consume(token);
    if (!userId) {
        return res.status(400).json({ success: false, message: "This reset link is invalid or has expired." });
    }
    const passwordHash = await (0, auth_service_1.hashPassword)(newPassword);
    await prisma_1.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    await (0, auth_service_1.revokeAllUserSessions)(userId);
    await (0, activity_service_1.logActivity)({ userId, type: "PASSWORD_RESET", metadata: { stage: "completed" } });
    return res.json({ success: true, message: "Your password has been reset. Please log in." });
}
