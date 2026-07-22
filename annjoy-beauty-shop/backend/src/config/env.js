"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("./loadEnv");
function required(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (!value)
        throw new Error(`[env] Missing required env var: ${name}`);
    return value;
}
exports.env = {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    databaseUrl: required("DATABASE_URL", "postgresql://user:password@localhost:5432/annjoy_beauty"),
    jwtAccessSecret: required("JWT_ACCESS_SECRET", "dev-access-secret-change-me"),
    jwtRefreshSecret: required("JWT_REFRESH_SECRET", "dev-refresh-secret-change-me"),
    accessTokenTtl: process.env.ACCESS_TOKEN_TTL || "15m",
    refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS) || 30,
    cookieSecure: process.env.NODE_ENV === "production",
    // Comma-separated list — e.g. "http://localhost:3000,http://192.168.1.42:3000"
    // so the same backend accepts requests from both your laptop's browser
    // (localhost) AND your phone's browser (your laptop's LAN IP) at once.
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};
