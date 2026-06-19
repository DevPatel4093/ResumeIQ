import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createId, memory, publicUser } from "../utils/memoryStore.js";

function tokenFor(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role = "candidate" } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required");
    }

    if (globalThis.__USE_MEMORY_DB__) {
      const exists = memory.users.some((user) => user.email === email.toLowerCase());
      if (exists) {
        res.status(409);
        throw new Error("Email already registered");
      }
      const user = {
        id: createId(),
        name,
        email: email.toLowerCase(),
        password: await bcrypt.hash(password, 10),
        role,
        createdAt: new Date().toISOString()
      };
      memory.users.push(user);
      return res.status(201).json({ user: publicUser(user), token: tokenFor(user.id) });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(409);
      throw new Error("Email already registered");
    }
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: tokenFor(user._id) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (globalThis.__USE_MEMORY_DB__) {
      const user = memory.users.find((item) => item.email === email?.toLowerCase());
      if (!user || !(await bcrypt.compare(password || "", user.password))) {
        res.status(401);
        throw new Error("Invalid email or password");
      }
      return res.json({ user: publicUser(user), token: tokenFor(user.id) });
    }

    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: tokenFor(user._id) });
  } catch (error) {
    next(error);
  }
}

export async function profile(req, res) {
  res.json({ user: req.user });
}
