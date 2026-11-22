import { Router } from "express";
import { register, login, me, googleAuth } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/google", asyncHandler(googleAuth));
router.get("/me", requireAuth, asyncHandler(me));

export default router;
