import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { Role } from "@prisma/client";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface AccessTokenPayload {
  userId: string;
  role: Role;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.accessTokenTtl });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
}

/**
 * Refresh tokens are opaque random strings stored (hashed) in the DB,
 * not JWTs — this lets us revoke individual sessions ("logout from all
 * devices") without needing a blocklist.
 */
export async function issueRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + env.refreshTokenTtlDays * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { token: hashToken(token), userId, expiresAt },
  });

  return token; // raw token goes to the client cookie; only the hash is stored
}

export async function rotateRefreshToken(oldToken: string): Promise<{ userId: string; newToken: string } | null> {
  const hashed = hashToken(oldToken);
  const record = await prisma.refreshToken.findUnique({ where: { token: hashed } });
  if (!record || record.expiresAt < new Date()) return null;

  await prisma.refreshToken.delete({ where: { id: record.id } });
  const newToken = await issueRefreshToken(record.userId);
  return { userId: record.userId, newToken };
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { token: hashToken(token) } });
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { userId } });
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
