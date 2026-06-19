import { Router } from "express";
import { getResume, listResumes, uploadResume } from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/all", protect, listResumes);
router.get("/:id", protect, getResume);

export default router;
