"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const admin_validators_1 = require("../validators/admin.validators");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
// Every route here is ADMIN-only — user management, moderation, and the
// activity trail are not something STAFF/STYLIST accounts should see.
router.use(auth_1.requireAuth, (0, auth_1.requireRole)("ADMIN"));
router.get("/users", (0, asyncHandler_1.asyncHandler)(admin_controller_1.listUsers));
router.get("/users/:id/activity", (0, asyncHandler_1.asyncHandler)(admin_controller_1.getUserActivity));
router.post("/users", (0, validate_1.validateBody)(admin_validators_1.createUserSchema), (0, asyncHandler_1.asyncHandler)(admin_controller_1.createUser));
router.patch("/users/:id/role", (0, validate_1.validateBody)(admin_validators_1.updateRoleSchema), (0, asyncHandler_1.asyncHandler)(admin_controller_1.updateUserRole));
router.patch("/users/:id/status", (0, validate_1.validateBody)(admin_validators_1.updateStatusSchema), (0, asyncHandler_1.asyncHandler)(admin_controller_1.updateUserStatus));
exports.default = router;
