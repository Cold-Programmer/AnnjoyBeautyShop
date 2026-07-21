import { Router } from "express";
import { listServices, getServiceBySlug, createService, updateService, deleteService } from "../controllers/services.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", requireAuth, asyncHandler(listServices));
router.get("/:slug", requireAuth, asyncHandler(getServiceBySlug));
router.post("/", requireAuth, requireRole("ADMIN", "STAFF"), asyncHandler(createService));
router.patch("/:id", requireAuth, requireRole("ADMIN", "STAFF"), asyncHandler(updateService));
router.delete("/:id", requireAuth, requireRole("ADMIN"), asyncHandler(deleteService));

export default router;
