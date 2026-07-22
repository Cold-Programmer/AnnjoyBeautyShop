"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
/**
 * Validates req.body against a Zod schema. On failure, responds 400 with
 * field-level messages instead of letting a malformed body reach the
 * controller (and potentially Prisma / M-Pesa) unchecked.
 */
function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: result.error.flatten().fieldErrors,
            });
        }
        req.body = result.data;
        next();
    };
}
