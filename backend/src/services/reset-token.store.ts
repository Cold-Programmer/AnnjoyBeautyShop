import crypto from "crypto";

interface ResetRecord {
  userId: string;
  expiresAt: number;
}

/**
 * Minimal in-memory store for password-reset tokens, mirroring
 * transaction.store.ts. Swap for a DB-backed table (with a hashed token
 * column, same pattern as RefreshToken) before going to production so
 * tokens survive a server restart.
 */
class ResetTokenStore {
  private tokens = new Map<string, ResetRecord>();

  create(userId: string): string {
    const token = crypto.randomBytes(32).toString("hex");
    this.tokens.set(token, { userId, expiresAt: Date.now() + 60 * 60 * 1000 }); // 1 hour
    return token;
  }

  consume(token: string): string | null {
    const record = this.tokens.get(token);
    if (!record || record.expiresAt < Date.now()) return null;
    this.tokens.delete(token); // one-time use
    return record.userId;
  }
}

export const resetTokenStore = new ResetTokenStore();
