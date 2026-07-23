import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";

import { env } from "./config/env";
import {
  errorHandler,
  notFoundHandler,
  registerProcessSafetyNets,
} from "./middleware/errorHandler";

import authRoutes from "./routes/auth.routes";
import servicesRoutes from "./routes/services.routes";
import productsRoutes from "./routes/products.routes";
import appointmentsRoutes from "./routes/appointments.routes";
import ordersRoutes from "./routes/orders.routes";
import mpesaRoutes from "./routes/mpesa.routes";
import adminRoutes from "./routes/admin.routes";
import activityRoutes from "./routes/activity.routes";
import uploadRoutes from "./routes/upload.routes";

registerProcessSafetyNets();

const app = express();

/**
 * Required when running behind Render's reverse proxy.
 */
app.set("trust proxy", 1);

/**
 * Security
 */
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

/**
 * CORS
 */
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);

/**
 * Body parsers
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Global Rate Limiter
 */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/**
 * Static uploads
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * Root
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    application: "GLOW 'N' GO Beauty & Cosmetics API",
    version: "1.0.0",
    environment: env.nodeEnv,
    status: "running",
    documentation: "/api",
    health: "/api/health",
  });
});

/**
 * API Root
 */
app.get("/api", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to GLOW 'N' GO Beauty & Cosmetics API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      services: "/api/services",
      appointments: "/api/appointments",
      orders: "/api/orders",
      mpesa: "/api/mpesa",
      admin: "/api/admin",
      activity: "/api/activity",
      uploads: "/api/uploads",
      health: "/api/health",
    },
  });
});

/**
 * Health Check
 */
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
    memory: process.memoryUsage(),
  });
});

/**
 * Readiness Check
 */
app.get("/api/ready", (_req, res) => {
  res.status(200).json({
    success: true,
    ready: true,
    message: "Application is ready to accept requests.",
  });
});

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/uploads", uploadRoutes);

/**
 * 404 Handler
 */
app.use(notFoundHandler);

/**
 * Global Error Handler
 */
app.use(errorHandler);

/**
 * Start Server
 */
const server = app.listen(env.port, () => {
  console.log("======================================");
  console.log("🚀 GLOW 'N' GO Backend Started");
  console.log(`🌍 Environment : ${env.nodeEnv}`);
  console.log(`📡 Port        : ${env.port}`);
  console.log(`❤️ Health      : /api/health`);
  console.log(`📖 API Root    : /api`);
  console.log("======================================");
});

/**
 * Prevent dropped connections on Render.
 */
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

export default app;
