import { Router } from "express";
import { createAppointment, listMyAppointments, listAssignedAppointments, updateAppointmentStatus, cancelAppointment, getAppointmentByToken, confirmByToken } from "../controllers/appointments.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createAppointmentSchema } from "../validators/booking.validators";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post("/", requireAuth, validateBody(createAppointmentSchema), asyncHandler(createAppointment));
router.get("/me", requireAuth, asyncHandler(listMyAppointments));
router.get("/assigned", requireAuth, requireRole("STYLIST", "STAFF", "ADMIN"), asyncHandler(listAssignedAppointments));
router.patch("/:id/status", requireAuth, requireRole("ADMIN", "STAFF", "STYLIST"), asyncHandler(updateAppointmentStatus));
router.post("/:id/cancel", requireAuth, asyncHandler(cancelAppointment));

// QR check-in flow — see getAppointmentByToken/confirmByToken for the
// security rationale (unguessable per-appointment token, not a sequential id).
router.get("/verify/:qrToken", asyncHandler(getAppointmentByToken));
router.post("/verify/:qrToken/confirm", requireAuth, requireRole("ADMIN", "STAFF", "STYLIST"), asyncHandler(confirmByToken));

export default router;
