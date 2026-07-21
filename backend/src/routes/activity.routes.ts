import { Router } from "express";
import { recordPageView } from "../controllers/activity.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();
router.post("/", asyncHandler(recordPageView)); // auth optional — see recordPageView

export default router;
