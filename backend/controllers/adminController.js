import User from "../models/User.js";
import Resume from "../models/Resume.js";
import Analysis from "../models/Analysis.js";
import { memory, publicUser } from "../utils/memoryStore.js";

export async function stats(_req, res, next) {
  try {
    if (globalThis.__USE_MEMORY_DB__) {
      const avgScore = average(memory.analyses.map((item) => item.atsScore));
      return res.json({
        users: memory.users.length,
        resumes: memory.resumes.length,
        reports: memory.analyses.length,
        avgScore
      });
    }

    const [users, resumes, reports, analyses] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Analysis.countDocuments(),
      Analysis.find().select("atsScore")
    ]);
    res.json({ users, resumes, reports, avgScore: average(analyses.map((item) => item.atsScore)) });
  } catch (error) {
    next(error);
  }
}

export async function users(_req, res, next) {
  try {
    if (globalThis.__USE_MEMORY_DB__) {
      return res.json({ users: memory.users.map(publicUser) });
    }
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
}

export async function reports(_req, res, next) {
  try {
    if (globalThis.__USE_MEMORY_DB__) {
      return res.json({ reports: memory.analyses });
    }
    const reports = await Analysis.find().sort({ createdAt: -1 }).limit(100);
    res.json({ reports });
  } catch (error) {
    next(error);
  }
}

function average(values) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length);
}
