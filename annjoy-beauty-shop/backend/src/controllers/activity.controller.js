"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordPageView = recordPageView;
const activity_service_1 = require("../services/activity.service");
/**
 * POST /api/activity — the frontend calls this on route changes to
 * record a PAGE_VIEW. Deliberately not authenticated-only: guests
 * browsing pre-login still get a path recorded against no userId, which
 * still matters for the "no page viewable without an account" wall — it
 * shows what an unauthenticated visitor tried to reach.
 */
async function recordPageView(req, res) {
    const { path } = req.body;
    if (!path || typeof path !== "string") {
        return res.status(400).json({ success: false, message: "path is required." });
    }
    await (0, activity_service_1.logActivity)({
        userId: req.user?.userId,
        type: "PAGE_VIEW",
        path,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
    });
    res.status(204).end();
}
