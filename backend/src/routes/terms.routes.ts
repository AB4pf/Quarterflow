import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { createTerm, listTerms } from "../controllers/terms.controller";

const router = Router();

router.post("/", requireAuth, asyncHandler(createTerm));
router.get("/", requireAuth, asyncHandler(listTerms));

export default router;
