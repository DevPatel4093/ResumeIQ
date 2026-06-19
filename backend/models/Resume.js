import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    mimeType: String,
    extractedText: String,
    parsed: Object
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
