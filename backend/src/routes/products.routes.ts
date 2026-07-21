import { Router } from "express";
import { listProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", requireAuth, asyncHandler(listProducts));
router.get("/:slug", requireAuth, asyncHandler(getProductBySlug));
router.post("/", requireAuth, requireRole("ADMIN", "STAFF"), asyncHandler(createProduct));
router.patch("/:id", requireAuth, requireRole("ADMIN", "STAFF"), asyncHandler(updateProduct));
router.delete("/:id", requireAuth, requireRole("ADMIN"), asyncHandler(deleteProduct));

export default router;
