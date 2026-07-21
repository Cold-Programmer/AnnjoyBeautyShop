import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`[env] Missing required env var: ${name}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: required("DATABASE_URL", "postgresql://user:password@localhost:5432/annjoy_beauty"),
  jwtAccessSecret: required("JWT_ACCESS_SECRET", "dev-access-secret-change-me"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET", "dev-refresh-secret-change-me"),
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || "15m",
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS) || 30,
  cookieSecure: process.env.NODE_ENV === "production",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};
