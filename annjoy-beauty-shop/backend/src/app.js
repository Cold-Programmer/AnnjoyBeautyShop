"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const services_routes_1 = __importDefault(require("./routes/services.routes"));
const products_routes_1 = __importDefault(require("./routes/products.routes"));
const appointments_routes_1 = __importDefault(require("./routes/appointments.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const mpesa_routes_1 = __importDefault(require("./routes/mpesa.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const activity_routes_1 = __importDefault(require("./routes/activity.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const stylists_routes_1 = __importDefault(require("./routes/stylists.routes"));
(0, errorHandler_1.registerProcessSafetyNets)();
const app = (0, express_1.default)();
// crossOriginResourcePolicy relaxed so the frontend (a different origin/
// port in dev) can actually load images served from /uploads — Helmet's
// default of "same-origin" would silently block them.
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
const allowedOrigins = env_1.env.corsOrigin.split(",").map((o) => o.trim()).filter(Boolean);
app.use((0, cors_1.default)({
    origin(origin, callback) {
        // No Origin header (curl, server-to-server, same-origin) — allow.
        if (!origin || allowedOrigins.includes(origin))
            return callback(null, true);
        callback(new Error(`Origin ${origin} is not in CORS_ORIGIN. Add it (comma-separated) in backend/.env.`));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Global baseline rate limit; auth + payment routes have their own
// tighter limits layered on top (defined in their respective route files).
app.use((0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.get("/health", (_req, res) => res.status(200).json({ status: "ok", env: env_1.env.nodeEnv }));
const ROUTE_GROUPS = {
    "/api/auth": "register, login, verify-email, forgot/reset-password, me",
    "/api/users": "me (profile), me/password (change password)",
    "/api/stylists": "list active stylists (for the booking form)",
    "/api/services": "salon services catalog",
    "/api/products": "shop catalog (category/gender filters)",
    "/api/appointments": "booking, QR verify/confirm, assigned (stylist)",
    "/api/orders": "checkout, order history, status updates",
    "/api/mpesa": "STK push, callback, payment status",
    "/api/admin": "user management, roles, moderation (ADMIN only)",
    "/api/activity": "page-view logging",
    "/api/uploads": "file upload → URL",
};
// GET /api — quick reference so "what endpoints does this backend have"
// is answerable by curling the server, not by reading source.
app.get("/api", (_req, res) => {
    res.json({
        success: true,
        service: "GLOW 'N' GO API",
        routes: ROUTE_GROUPS,
    });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", users_routes_1.default);
app.use("/api/stylists", stylists_routes_1.default);
app.use("/api/services", services_routes_1.default);
app.use("/api/products", products_routes_1.default);
app.use("/api/appointments", appointments_routes_1.default);
app.use("/api/orders", orders_routes_1.default);
app.use("/api/mpesa", mpesa_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/activity", activity_routes_1.default);
app.use("/api/uploads", upload_routes_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler); // must be last
const server = app.listen(env_1.env.port, () => {
    console.log(`[server] GLOW 'N' GO API running on port ${env_1.env.port} (${env_1.env.nodeEnv})`);
    console.log(`[server] Mounted route groups:`);
    Object.entries(ROUTE_GROUPS).forEach(([path, desc]) => console.log(`  ${path.padEnd(18)} — ${desc}`));
    console.log(`[server] Full index: GET http://localhost:${env_1.env.port}/api`);
});
// Avoid dropped connections behind a reverse proxy with a shorter timeout.
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
exports.default = app;
