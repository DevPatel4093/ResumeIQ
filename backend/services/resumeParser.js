import fs from "fs/promises";
import pdf from "pdf-parse";
import mammoth from "mammoth";

const skillBank = [
  "React", "Node.js", "Express", "MongoDB", "JavaScript", "TypeScript", "Python", "Java",
  "SQL", "PostgreSQL", "REST APIs", "GraphQL", "Git", "Docker", "AWS", "Azure", "GCP",
  "Tailwind CSS", "Redux", "Next.js", "HTML", "CSS", "Machine Learning", "CI/CD", "Jest",
  "Agile", "Leadership", "Communication", "Problem Solving"
];

export async function extractResumeText(filePath, mimeType) {
  if (mimeType === "application/pdf") {
    const data = await fs.readFile(filePath);
    const parsed = await pdf(data);
    return parsed.text;
  }

  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

export function parseResumeText(text = "") {
  const normalized = text.replace(/\s+/g, " ").trim();
  const email = normalized.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = normalized.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4}/)?.[0] || "";
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const name = lines.find((line) => !line.includes("@") && !/\d{4,}/.test(line)) || "Candidate";
  const lower = normalized.toLowerCase();
  const skills = skillBank.filter((skill) => lower.includes(skill.toLowerCase()));

  return {
    name,
    email,
    phone,
    skills,
    education: sectionSnippet(text, ["education", "academic"]),
    experience: sectionSnippet(text, ["experience", "employment", "work history"]),
    projects: sectionSnippet(text, ["projects", "portfolio"]),
    certifications: sectionSnippet(text, ["certifications", "certificates"])
  };
}

function sectionSnippet(text, headings) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const start = lines.findIndex((line) => headings.some((heading) => line.toLowerCase().includes(heading)));
  if (start === -1) return "";
  return lines.slice(start, start + 5).join(" ");
}
