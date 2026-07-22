"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointments_controller_1 = require("../controllers/appointments.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const booking_validators_1 = require("../validators/booking.validators");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
router.post("/", auth_1.requireAuth, (0, validate_1.validateBody)(booking_validators_1.createAppointmentSchema), (0, asyncHandler_1.asyncHandler)(appointments_controller_1.createAppointment));
router.get("/me", auth_1.requireAuth, (0, asyncHandler_1.asyncHandler)(appointments_controller_1.listMyAppointments));
router.get("/assigned", auth_1.requireAuth, (0, auth_1.requireRole)("STYLIST", "STAFF", "ADMIN"), (0, asyncHandler_1.asyncHandler)(appointments_controller_1.listAssignedAppointments));
router.patch("/:id/status", auth_1.requireAuth, (0, auth_1.requireRole)("ADMIN", "STAFF", "STYLIST"), (0, asyncHandler_1.asyncHandler)(appointments_controller_1.updateAppointmentStatus));
router.post("/:id/cancel", auth_1.requireAuth, (0, asyncHandler_1.asyncHandler)(appointments_controller_1.cancelAppointment));
// QR check-in flow — see getAppointmentByToken/confirmByToken for the
// security rationale (unguessable per-appointment token, not a sequential id).
router.get("/verify/:qrToken", (0, asyncHandler_1.asyncHandler)(appointments_controller_1.getAppointmentByToken));
router.post("/verify/:qrToken/confirm", auth_1.requireAuth, (0, auth_1.requireRole)("ADMIN", "STAFF", "STYLIST"), (0, asyncHandler_1.asyncHandler)(appointments_controller_1.confirmByToken));
exports.default = router;
