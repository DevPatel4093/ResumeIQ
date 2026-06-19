import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { memory, publicUser } from "../utils/memoryStore.js";

export async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401);
    return next(new Error("Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    if (globalThis.__USE_MEMORY_DB__) {
      const user = memory.users.find((item) => item.id === decoded.id);
      req.user = publicUser(user);
    } else {
      req.user = await User.findById(decoded.id).select("-password");
    }
    if (!req.user) throw new Error("User not found");
    next();
  } catch {
    res.status(401);
    next(new Error("Invalid or expired token"));
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    res.status(403);
    return next(new Error("Admin access required"));
  }
  next();
}
