import OpenAI from "openai";

const knownSkills = [
  "React", "Node.js", "Express", "MongoDB", "JavaScript", "TypeScript", "Python", "Java",
  "SQL", "PostgreSQL", "REST APIs", "GraphQL", "Git", "Docker", "AWS", "Azure", "GCP",
  "Tailwind CSS", "Redux", "Next.js", "HTML", "CSS", "Machine Learning", "CI/CD", "Jest",
  "Agile", "Leadership", "Communication", "Problem Solving"
];

export async function analyzeResume({ resumeText, parsedResume, jobDescription, jobTitle }) {
  const local = buildLocalAnalysis({ resumeText, parsedResume, jobDescription, jobTitle });

  if (!process.env.OPENAI_API_KEY) return local;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Return concise JSON with strengths, weaknesses, suggestions arrays for a resume compared to a job description." },
        { role: "user", content: JSON.stringify({ resumeText: resumeText.slice(0, 6000), jobDescription: jobDescription.slice(0, 4000), local }) }
      ]
    });
    const ai = JSON.parse(response.choices[0].message.content);
    return { ...local, ...ai, aiEnhanced: true };
  } catch {
    return { ...local, aiEnhanced: false };
  }
}

function buildLocalAnalysis({ resumeText = "", parsedResume = {}, jobDescription = "", jobTitle = "" }) {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();
  const requiredSkills = knownSkills.filter((skill) => jdLower.includes(skill.toLowerCase()));
  const resumeSkills = new Set((parsedResume.skills || []).map((skill) => skill.toLowerCase()));
  const matchedSkills = requiredSkills.filter((skill) => resumeSkills.has(skill.toLowerCase()) || resumeLower.includes(skill.toLowerCase()));
  const missingSkills = requiredSkills.filter((skill) => !matchedSkills.includes(skill));
  const keywords = extractKeywords(jobDescription);
  const matchedKeywords = keywords.filter((keyword) => resumeLower.includes(keyword.toLowerCase()));

  const keywordScore = percent(matchedKeywords.length, Math.max(keywords.length, 1));
  const skillsScore = requiredSkills.length ? percent(matchedSkills.length, requiredSkills.length) : 80;
  const experienceScore = scoreExperience(resumeText, jobDescription);
  const formattingScore = scoreFormatting(resumeText, parsedResume);
  const atsScore = Math.round(keywordScore * 0.4 + skillsScore * 0.3 + experienceScore * 0.2 + formattingScore * 0.1);

  return {
    jobTitle: jobTitle || inferJobTitle(jobDescription),
    atsScore,
    rating: ratingFor(atsScore),
    scoreBreakdown: {
      keywordMatch: keywordScore,
      skillsMatch: skillsScore,
      experienceMatch: experienceScore,
      formatting: formattingScore
    },
    matchedSkills,
    missingSkills,
    keywords: matchedKeywords.slice(0, 20),
    strengths: buildStrengths(matchedSkills, parsedResume, atsScore),
    weaknesses: buildWeaknesses(missingSkills, resumeText),
    suggestions: buildSuggestions(missingSkills, matchedKeywords, keywords),
    parsedResume
  };
}

function extractKeywords(text) {
  const words = text.toLowerCase().match(/[a-z][a-z+#.]{2,}/g) || [];
  const stop = new Set(["and", "the", "with", "for", "you", "are", "our", "will", "have", "from", "this", "that", "role", "work", "team"]);
  const counts = new Map();
  for (const word of words) {
    if (!stop.has(word)) counts.set(word, (counts.get(word) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([word]) => word);
}

function scoreExperience(resumeText, jd) {
  const years = Math.max(...(resumeText.match(/\b\d+\+?\s+years?\b/gi) || ["0 years"]).map((value) => Number.parseInt(value, 10)));
  const asksSenior = /senior|lead|principal|5\+|7\+/.test(jd.toLowerCase());
  if (asksSenior) return years >= 5 ? 92 : years >= 3 ? 74 : 55;
  return years >= 1 ? 86 : 68;
}

function scoreFormatting(text, parsed) {
  let score = 55;
  if (parsed.email) score += 10;
  if (parsed.phone) score += 10;
  if (/education/i.test(text)) score += 8;
  if (/experience|employment/i.test(text)) score += 8;
  if (/projects|portfolio/i.test(text)) score += 5;
  if (text.length > 900) score += 4;
  return Math.min(score, 100);
}

function percent(value, total) {
  return Math.round((value / total) * 100);
}

function ratingFor(score) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Average";
  return "Needs Improvement";
}

function inferJobTitle(jd) {
  return jd.split(/\r?\n/).find((line) => line.trim().length > 4)?.trim().slice(0, 80) || "Target Role";
}

function buildStrengths(matchedSkills, parsed, score) {
  const strengths = [];
  if (matchedSkills.length) strengths.push(`Matches core requirements: ${matchedSkills.slice(0, 5).join(", ")}.`);
  if (parsed.projects) strengths.push("Includes project experience that can support practical capability.");
  if (parsed.experience) strengths.push("Contains an experience section recruiters can scan quickly.");
  if (score >= 75) strengths.push("Overall ATS alignment is strong for the provided job description.");
  return strengths.length ? strengths : ["Resume has useful baseline information for analysis."];
}

function buildWeaknesses(missingSkills, text) {
  const weaknesses = [];
  if (missingSkills.length) weaknesses.push(`Missing visible job keywords: ${missingSkills.slice(0, 6).join(", ")}.`);
  if (!/\d+%|\$\d+|\b\d+x\b|\b\d+\+/.test(text)) weaknesses.push("Few measurable achievements or quantified outcomes were detected.");
  if (!/certification|certified/i.test(text)) weaknesses.push("No certification section was detected.");
  return weaknesses;
}

function buildSuggestions(missingSkills, matchedKeywords, keywords) {
  const suggestions = [];
  if (missingSkills.length) suggestions.push(`Add honest examples or projects involving ${missingSkills.slice(0, 4).join(", ")} if you have that experience.`);
  if (matchedKeywords.length < keywords.length * 0.5) suggestions.push("Mirror more important job description keywords in your skills, summary, and project bullets.");
  suggestions.push("Rewrite bullets with action verbs, business impact, and metrics such as latency reduced, revenue influenced, or users supported.");
  suggestions.push("Keep section headings standard: Summary, Skills, Experience, Projects, Education, Certifications.");
  return suggestions;
}
