import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Validates req.body against a Zod schema. On failure, responds 400 with
 * field-level messages instead of letting a malformed body reach the
 * controller (and potentially Prisma / M-Pesa) unchecked.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
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
