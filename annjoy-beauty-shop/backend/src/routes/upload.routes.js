"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const upload_controller_1 = require("../controllers/upload.controller");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
// Any authenticated user can upload (customers need it for their own
// profile photo; staff/stylist/admin need it for product/portfolio images).
router.post("/", auth_1.requireAuth, (req, res, next) => {
    (0, upload_1.uploadSingleImage)(req, res, (err) => {
        if (err)
            return res.status(400).json({ success: false, message: err.message });
        next();
    });
}, (0, asyncHandler_1.asyncHandler)(upload_controller_1.uploadImage));
exports.default = router;
