"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
exports.registerProcessSafetyNets = registerProcessSafetyNets;
/**
 * Catches any error thrown/passed to next() in route handlers.
 * Without this, an unhandled error can crash the Node process, which is
 * what causes intermittent 502 Bad Gateway responses at the reverse proxy.
 */
function errorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    console.error(`[error] ${req.method} ${req.originalUrl}:`, err.message || err);
    if (res.headersSent)
        return;
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error.",
    });
}
function notFoundHandler(req, res) {
    res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}
/**
 * Register these at the process level once, in your main entrypoint.
 * A crashed process behind Nginx/Vercel/Railway is the #1 cause of a
 * "randomly appearing" 502 — this keeps the process alive and logs instead.
 */
function registerProcessSafetyNets() {
    process.on("unhandledRejection", (reason) => {
        console.error("[process] Unhandled promise rejection:", reason);
    });
    process.on("uncaughtException", (err) => {
        console.error("[process] Uncaught exception:", err);
        // Do NOT process.exit() here in production unless you have a process
        // manager (PM2 / Docker restart policy) to bring it back up instantly.
    });
}
