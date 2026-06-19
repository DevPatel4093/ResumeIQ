import path from "path";
import Resume from "../models/Resume.js";
import { createId, memory } from "../utils/memoryStore.js";
import { extractResumeText, parseResumeText } from "../services/resumeParser.js";

export async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Resume file is required");
    }

    const extractedText = await extractResumeText(req.file.path, req.file.mimetype);
    const parsed = parseResumeText(extractedText);
    const fileUrl = `/uploads/${req.file.filename}`;

    if (globalThis.__USE_MEMORY_DB__) {
      const resume = {
        id: createId(),
        userId: req.user.id,
        fileName: req.file.originalname,
        storedName: path.basename(req.file.path),
        fileUrl,
        mimeType: req.file.mimetype,
        extractedText,
        parsed,
        createdAt: new Date().toISOString()
      };
      memory.resumes.push(resume);
      return res.status(201).json({ resume });
    }

    const resume = await Resume.create({
      userId: req.user._id || req.user.id,
      fileName: req.file.originalname,
      fileUrl,
      mimeType: req.file.mimetype,
      extractedText,
      parsed
    });
    res.status(201).json({ resume });
  } catch (error) {
    next(error);
  }
}

export async function listResumes(req, res, next) {
  try {
    if (globalThis.__USE_MEMORY_DB__) {
      const resumes = memory.resumes.filter((resume) => resume.userId === req.user.id);
      return res.json({ resumes });
    }

    const resumes = await Resume.find({ userId: req.user._id || req.user.id }).sort({ createdAt: -1 });
    res.json({ resumes });
  } catch (error) {
    next(error);
  }
}

export async function getResume(req, res, next) {
  try {
    if (globalThis.__USE_MEMORY_DB__) {
      const resume = memory.resumes.find((item) => item.id === req.params.id && item.userId === req.user.id);
      if (!resume) {
        res.status(404);
        throw new Error("Resume not found");
      }
      return res.json({ resume });
    }

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id || req.user.id });
    if (!resume) {
      res.status(404);
      throw new Error("Resume not found");
    }
    res.json({ resume });
  } catch (error) {
    next(error);
  }
}
