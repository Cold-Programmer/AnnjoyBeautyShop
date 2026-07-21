import { Router } from "express";
import { listUsers, getUserActivity, createUser, updateUserRole, updateUserStatus } from "../controllers/admin.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createUserSchema, updateRoleSchema, updateStatusSchema } from "../validators/admin.validators";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

// Every route here is ADMIN-only — user management, moderation, and the
// activity trail are not something STAFF/STYLIST accounts should see.
router.use(requireAuth, requireRole("ADMIN"));

router.get("/users", asyncHandler(listUsers));
router.get("/users/:id/activity", asyncHandler(getUserActivity));
router.post("/users", validateBody(createUserSchema), asyncHandler(createUser));
router.patch("/users/:id/role", validateBody(updateRoleSchema), asyncHandler(updateUserRole));
router.patch("/users/:id/status", validateBody(updateStatusSchema), asyncHandler(updateUserStatus));

export default router;
