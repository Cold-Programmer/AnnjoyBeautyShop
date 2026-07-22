"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = logActivity;
const prisma_1 = require("../config/prisma");
/**
 * Records one activity event. Never throws — logging failures shouldn't
 * break the request that triggered them (a login shouldn't fail because
 * the audit-log insert failed).
 */
async function logActivity(input) {
    try {
        await prisma_1.prisma.activityLog.create({
            data: {
                userId: input.userId,
                type: input.type,
                path: input.path,
                metadata: input.metadata ? JSON.stringify(input.metadata) : undefined,
                ipAddress: input.ipAddress,
                userAgent: input.userAgent,
            },
        });
    }
    catch (err) {
        console.error("[activity] Failed to log event:", err.message);
    }
}
