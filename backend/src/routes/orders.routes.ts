import { Router } from "express";
import { createOrder, listMyOrders, getOrderById, updateOrderStatus } from "../controllers/orders.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createOrderSchema } from "../validators/booking.validators";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post("/", validateBody(createOrderSchema), asyncHandler(createOrder)); // guest checkout allowed
router.get("/me", requireAuth, asyncHandler(listMyOrders));
router.get("/:id", requireAuth, asyncHandler(getOrderById));
router.patch("/:id/status", requireAuth, requireRole("ADMIN", "STAFF"), asyncHandler(updateOrderStatus));

export default router;
