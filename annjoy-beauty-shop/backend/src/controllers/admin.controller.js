"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.getUserActivity = getUserActivity;
exports.createUser = createUser;
exports.updateUserRole = updateUserRole;
exports.updateUserStatus = updateUserStatus;
const prisma_1 = require("../config/prisma");
const auth_service_1 = require("../services/auth.service");
const activity_service_1 = require("../services/activity.service");
/**
 * GET /api/admin/users — the "who's on the system, and are they behaving"
 * view. For each user: role/status, verification state, last seen / last
 * login (from the heartbeat in requireAuth + login()), and a rollup of
 * their most recent activity events (logins, page views, moderation
 * history) — see the ActivityLog model's doc-comment in schema.prisma for
 * why this is event-level rather than full click tracking.
 */
async function listUsers(req, res) {
    const { role, status, search, page = "1", limit = "30" } = req.query;
    const take = Math.min(Number(limit) || 30, 100);
    const skip = (Math.max(Number(page) || 1, 1) - 1) * take;
    const where = {
        ...(role ? { role: String(role).toUpperCase() } : {}),
        ...(status ? { status: String(status).toUpperCase() } : {}),
        ...(search
            ? {
                OR: [
                    { firstName: { contains: String(search), mode: "insensitive" } },
                    { lastName: { contains: String(search), mode: "insensitive" } },
                    { email: { contains: String(search), mode: "insensitive" } },
                    { phone: { contains: String(search), mode: "insensitive" } },
                ],
            }
            : {}),
    };
    const [users, total] = await Promise.all([
        prisma_1.prisma.user.findMany({
            where,
            select: {
                id: true, firstName: true, lastName: true, email: true, phone: true, role: true, status: true,
                emailVerified: true, lastSeenAt: true, lastLoginAt: true, createdAt: true,
                _count: { select: { orders: true, appointments: true, activityLogs: true } },
            },
            take,
            skip,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.prisma.user.count({ where }),
    ]);
    // "Online" here means "sent a heartbeat in the last 5 minutes" (every
    // authenticated request refreshes lastSeenAt) — a reasonable proxy for
    // presence without a persistent websocket connection.
    const ONLINE_WINDOW_MS = 5 * 60 * 1000;
    const now = Date.now();
    const withPresence = users.map((u) => ({
        ...u,
        isOnline: u.lastSeenAt ? now - u.lastSeenAt.getTime() < ONLINE_WINDOW_MS : false,
    }));
    res.json({ success: true, users: withPresence, page: Number(page), limit: take, total, totalPages: Math.ceil(total / take) });
}
/** GET /api/admin/users/:id/activity — full event trail for one user. */
async function getUserActivity(req, res) {
    const logs = await prisma_1.prisma.activityLog.findMany({
        where: { userId: req.params.id },
        orderBy: { createdAt: "desc" },
        take: 100,
    });
    res.json({ success: true, logs });
}
async function createUser(req, res) {
    const { firstName, lastName, email, phone, password, role, title, bio } = req.body;
    const existing = await prisma_1.prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
    if (existing) {
        return res.status(409).json({ success: false, message: "An account with that email or phone already exists." });
    }
    const passwordHash = await (0, auth_service_1.hashPassword)(password);
    const user = await prisma_1.prisma.user.create({
        data: { firstName, lastName, email, phone, passwordHash, role, title, bio, emailVerified: true }, // admin-created accounts skip OTP
    });
    res.status(201).json({ success: true, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
}
async function updateUserRole(req, res) {
    const { role } = req.body;
    const user = await prisma_1.prisma.user.update({ where: { id: req.params.id }, data: { role } });
    res.json({ success: true, user: { id: user.id, role: user.role } });
}
/**
 * PATCH /api/admin/users/:id/status — suspend / flag-for-security-review /
 * reactivate / soft-delete. Blocked immediately on the user's next request
 * because requireAuth re-checks status on every call, not just at login.
 */
async function updateUserStatus(req, res) {
    if (req.params.id === req.user?.userId) {
        return res.status(400).json({ success: false, message: "You can't change your own account status." });
    }
    const { status, reason } = req.body;
    const user = await prisma_1.prisma.user.update({ where: { id: req.params.id }, data: { status } });
    const activityType = status === "SUSPENDED" ? "ACCOUNT_SUSPENDED" : status === "FLAGGED" ? "ACCOUNT_FLAGGED" : status === "ACTIVE" ? "ACCOUNT_REACTIVATED" : null;
    if (activityType) {
        await (0, activity_service_1.logActivity)({ userId: user.id, type: activityType, metadata: { reason, by: req.user?.userId } });
    }
    // If suspended/flagged/deleted, kill their active sessions so a
    // still-valid refresh token can't quietly issue new access tokens.
    if (status !== "ACTIVE") {
        await prisma_1.prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    }
    res.json({ success: true, user: { id: user.id, status: user.status } });
}
