import mongoose from "mongoose";

export async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    globalThis.__USE_MEMORY_DB__ = true;
    console.log("MONGO_URI not set. Using in-memory storage for local demos.");
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);
  globalThis.__USE_MEMORY_DB__ = false;
  console.log("MongoDB connected.");
}
