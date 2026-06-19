import Analysis from "../models/Analysis.js";
import Resume from "../models/Resume.js";
import { analyzeResume } from "../services/analyzerService.js";
import { createId, memory } from "../utils/memoryStore.js";

export async function analyze(req, res, next) {
  try {
    const { resumeId, jobDescription, jobTitle } = req.body;
    if (!resumeId || !jobDescription) {
      res.status(400);
      throw new Error("Resume and job description are required");
    }

    let resume;
    if (globalThis.__USE_MEMORY_DB__) {
      resume = memory.resumes.find((item) => item.id === resumeId && item.userId === req.user.id);
    } else {
      resume = await Resume.findOne({ _id: resumeId, userId: req.user._id || req.user.id });
    }

    if (!resume) {
      res.status(404);
      throw new Error("Resume not found");
    }

    const result = await analyzeResume({
      resumeText: resume.extractedText,
      parsedResume: resume.parsed,
      jobDescription,
      jobTitle
    });

    if (globalThis.__USE_MEMORY_DB__) {
      const analysis = {
        id: createId(),
        userId: req.user.id,
        resumeId,
        jobDescription,
        ...result,
        createdAt: new Date().toISOString()
      };
      memory.analyses.push(analysis);
      return res.status(201).json({ analysis });
    }

    const analysis = await Analysis.create({
      userId: req.user._id || req.user.id,
      resumeId,
      jobDescription,
      ...result
    });
    res.status(201).json({ analysis });
  } catch (error) {
    next(error);
  }
}

export async function history(req, res, next) {
  try {
    if (globalThis.__USE_MEMORY_DB__) {
      const analyses = memory.analyses.filter((item) => item.userId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ analyses });
    }

    const analyses = await Analysis.find({ userId: req.user._id || req.user.id }).sort({ createdAt: -1 });
    res.json({ analyses });
  } catch (error) {
    next(error);
  }
}

export async function getAnalysis(req, res, next) {
  try {
    if (globalThis.__USE_MEMORY_DB__) {
      const analysis = memory.analyses.find((item) => item.id === req.params.id && item.userId === req.user.id);
      if (!analysis) {
        res.status(404);
        throw new Error("Analysis not found");
      }
      return res.json({ analysis });
    }

    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user._id || req.user.id });
    if (!analysis) {
      res.status(404);
      throw new Error("Analysis not found");
    }
    res.json({ analysis });
  } catch (error) {
    next(error);
  }
}
