"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activity_controller_1 = require("../controllers/activity.controller");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
router.post("/", (0, asyncHandler_1.asyncHandler)(activity_controller_1.recordPageView)); // auth optional — see recordPageView
exports.default = router;
