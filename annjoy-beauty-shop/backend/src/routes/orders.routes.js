"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_controller_1 = require("../controllers/orders.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const booking_validators_1 = require("../validators/booking.validators");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
router.post("/", (0, validate_1.validateBody)(booking_validators_1.createOrderSchema), (0, asyncHandler_1.asyncHandler)(orders_controller_1.createOrder)); // guest checkout allowed
router.get("/me", auth_1.requireAuth, (0, asyncHandler_1.asyncHandler)(orders_controller_1.listMyOrders));
router.get("/:id", auth_1.requireAuth, (0, asyncHandler_1.asyncHandler)(orders_controller_1.getOrderById));
router.patch("/:id/status", auth_1.requireAuth, (0, auth_1.requireRole)("ADMIN", "STAFF"), (0, asyncHandler_1.asyncHandler)(orders_controller_1.updateOrderStatus));
exports.default = router;
