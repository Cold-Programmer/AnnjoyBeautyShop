"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = asyncHandler;
/**
 * Wraps an async route handler so a thrown error or rejected promise is
 * passed to next(err) — Express does NOT do this automatically for async
 * functions. Without this, an unexpected error (bad input reaching a
 * Prisma call, a typo'd field, a downstream service timing out) would
 * either hang the request or crash the process instead of returning a
 * clean error response. Every controller in this app is wrapped with
 * this, so "the user did something unexpected" can never take the
 * server down — it always ends in errorHandler's JSON response instead.
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
