"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProfile = getMyProfile;
exports.updateMyProfile = updateMyProfile;
exports.changeMyPassword = changeMyPassword;
const prisma_1 = require("../config/prisma");
const auth_service_1 = require("../services/auth.service");
const activity_service_1 = require("../services/activity.service");
/** GET /api/users/me — the live version of what the dashboard/settings
 * pages used to show as static mock numbers. */
async function getMyProfile(req, res) {
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
    const [appointmentCount, orderCount] = await Promise.all([
        prisma_1.prisma.appointment.count({ where: { customerId: user.id, status: { in: ["PENDING", "CONFIRMED"] } } }),
        prisma_1.prisma.order.count({ where: { userId: user.id } }),
    ]);
    res.json({ success: true, user, stats: { upcomingAppointments: appointmentCount, orders: orderCount } });
}
/** PATCH /api/users/me — real profile updates, replacing the settings
 * page's previously non-functional Save button. */
async function updateMyProfile(req, res) {
    if (!req.user)
        return res.status(401).json({ success: false, message: "Authentication required." });
    const data = { ...req.body };
    if (data.avatarUrl === "")
        delete data.avatarUrl; // don't overwrite with empty string
    const user = await prisma_1.prisma.user.update({
        where: { id: req.user.userId },
        data,
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatarUrl: true, title: true, bio: true },
    });
    res.json({ success: true, user });
}
/** PATCH /api/users/me/password — real "change password" action, with
 * current-password verification, replacing the settings page's
 * previously non-functional button. */
async function changeMyPassword(req, res) {
    if (!req.user)
        return res.status(401).json({ success: false, message: "Authentication required." });
    const { currentPassword, newPassword } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !(await (0, auth_service_1.verifyPassword)(currentPassword, user.passwordHash))) {
        return res.status(400).json({ success: false, message: "Current password is incorrect." });
    }
    const passwordHash = await (0, auth_service_1.hashPassword)(newPassword);
    await prisma_1.prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    await (0, auth_service_1.revokeAllUserSessions)(user.id);
    await (0, activity_service_1.logActivity)({ userId: user.id, type: "PASSWORD_RESET", metadata: { stage: "changed_from_settings" } });
    res.json({ success: true, message: "Password updated. Please log in again on other devices." });
}
