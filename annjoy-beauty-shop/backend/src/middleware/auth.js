"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const auth_service_1 = require("../services/auth.service");
const prisma_1 = require("../config/prisma");
/**
 * Reads the access token from the httpOnly cookie (preferred) or the
 * Authorization header, attaches the decoded user to req.user, and
 * re-checks the account's live status on every request.
 *
 * That extra DB read is deliberate: a JWT alone can't be revoked mid-life,
 * so without this check, an admin suspending/flagging a user would only
 * take effect once their 15-minute access token naturally expired. This
 * makes moderation actions (suspend/flag/delete) effective immediately.
 */
async function requireAuth(req, res, next) {
    const bearer = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : undefined;
    const token = req.cookies?.accessToken || bearer;
    if (!token) {
        return res.status(401).json({ success: false, message: "Authentication required." });
    }
    try {
        const payload = (0, auth_service_1.verifyAccessToken)(token);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.userId },
            select: { status: true, role: true },
        });
        if (!user || user.status !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: user?.status === "SUSPENDED"
                    ? "Your account has been suspended. Contact support if you believe this is a mistake."
                    : user?.status === "FLAGGED"
                        ? "Your account is under security review and temporarily restricted."
                        : "This account no longer has access.",
            });
        }
        req.user = { userId: payload.userId, role: user.role };
        // Fire-and-forget — don't make every request wait on this write.
        prisma_1.prisma.user.update({ where: { id: payload.userId }, data: { lastSeenAt: new Date() } }).catch(() => { });
        next();
    }
    catch {
        return res.status(401).json({ success: false, message: "Invalid or expired session." });
    }
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Authentication required." });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "You don't have permission to do that." });
        }
        next();
    };
}
