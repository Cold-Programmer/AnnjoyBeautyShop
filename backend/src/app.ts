import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { env } from "./config/env";
import { errorHandler, notFoundHandler, registerProcessSafetyNets } from "./middleware/errorHandler";

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

// crossOriginResourcePolicy relaxed so the frontend (a different origin/
// port in dev) can actually load images served from /uploads — Helmet's
// default of "same-origin" would silently block them.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global baseline rate limit; auth + payment routes have their own
// tighter limits layered on top (defined in their respective route files).
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (_req, res) => res.status(200).json({ status: "ok", env: env.nodeEnv }));

app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler); // must be last

const server = app.listen(env.port, () => {
  console.log(`[server] GLOW 'N' GO API running on port ${env.port} (${env.nodeEnv})`);
});

// Avoid dropped connections behind a reverse proxy with a shorter timeout.
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;

export default app;
