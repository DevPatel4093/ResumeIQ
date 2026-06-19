import { Router } from "express";
import { analyze, getAnalysis, history } from "../controllers/analysisController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, analyze);
router.get("/history", protect, history);
router.get("/:id", protect, getAnalysis);

export default router;
