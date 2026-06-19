import { Router } from "express";
import { reports, stats, users } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, adminOnly);
router.get("/stats", stats);
router.get("/users", users);
router.get("/reports", reports);

export default router;
