import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../middleware/auth";
import { uploadSingleImage } from "../middleware/upload";
import { uploadImage } from "../controllers/upload.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

// Any authenticated user can upload (customers need it for their own
// profile photo; staff/stylist/admin need it for product/portfolio images).
router.post("/", requireAuth, (req: Request, res: Response, next: NextFunction) => {
  uploadSingleImage(req, res, (err: any) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, asyncHandler(uploadImage));

export default router;
