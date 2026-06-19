import crypto from "crypto";

export const memory = {
  users: [],
  resumes: [],
  analyses: []
};

export function createId() {
  return crypto.randomUUID();
}

export function publicUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}
