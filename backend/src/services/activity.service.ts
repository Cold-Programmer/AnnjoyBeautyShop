import { prisma } from "../config/prisma";
import { ActivityType } from "@prisma/client";

interface LogActivityInput {
  userId?: string;
  type: ActivityType;
  path?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Records one activity event. Never throws — logging failures shouldn't
 * break the request that triggered them (a login shouldn't fail because
 * the audit-log insert failed).
 */
export async function logActivity(input: LogActivityInput): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: input.userId,
        type: input.type,
        path: input.path,
        metadata: input.metadata ? JSON.stringify(input.metadata) : undefined,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });
  } catch (err: any) {
    console.error("[activity] Failed to log event:", err.message);
  }
}
