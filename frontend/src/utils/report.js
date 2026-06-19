export function downloadReport(analysis) {
  const rows = [
    `AI Resume Analyzer Report`,
    `Role: ${analysis.jobTitle}`,
    `ATS Score: ${analysis.atsScore}/100 (${analysis.rating})`,
    "",
    "Matched Skills:",
    ...(analysis.matchedSkills || []).map((item) => `- ${item}`),
    "",
    "Missing Skills:",
    ...(analysis.missingSkills || []).map((item) => `- ${item}`),
    "",
    "Strengths:",
    ...(analysis.strengths || []).map((item) => `- ${item}`),
    "",
    "Weaknesses:",
    ...(analysis.weaknesses || []).map((item) => `- ${item}`),
    "",
    "Suggestions:",
    ...(analysis.suggestions || []).map((item) => `- ${item}`)
  ];
  const blob = new Blob([rows.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `resume-analysis-${analysis.atsScore || "report"}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}
