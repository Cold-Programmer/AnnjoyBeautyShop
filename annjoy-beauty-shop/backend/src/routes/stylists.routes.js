"use strict";

const { Router } = require("express");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/asyncHandler");
const { listStylists } = require("../controllers/stylists.controller");

const router = Router();

router.get("/", requireAuth, asyncHandler(listStylists));

module.exports = router;
