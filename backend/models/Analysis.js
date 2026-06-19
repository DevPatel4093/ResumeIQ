import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    jobTitle: String,
    jobDescription: String,
    atsScore: Number,
    rating: String,
    scoreBreakdown: Object,
    matchedSkills: [String],
    missingSkills: [String],
    keywords: [String],
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    parsedResume: Object
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
