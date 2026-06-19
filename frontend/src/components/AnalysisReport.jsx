import { FiDownload } from "react-icons/fi";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { downloadReport } from "../utils/report.js";
import ScoreRing from "./ScoreRing.jsx";

export default function AnalysisReport({ analysis }) {
  if (!analysis) return null;
  const chartData = Object.entries(analysis.scoreBreakdown || {}).map(([name, value]) => ({
    name: name.replace(/([A-Z])/g, " $1"),
    value
  }));

  return (
    <section className="space-y-6">
      <div className="panel grid gap-6 p-6 lg:grid-cols-[180px_1fr_auto]">
        <ScoreRing score={analysis.atsScore} />
        <div>
          <p className="text-sm font-semibold text-brand">{analysis.rating}</p>
          <h2 className="mt-1 text-2xl font-bold">{analysis.jobTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Your resume was compared against the role requirements and scored across keywords, skills, experience, and formatting.
          </p>
        </div>
        <button className="btn-secondary h-10" onClick={() => downloadReport(analysis)}>
          <FiDownload /> Download
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <h3 className="mb-4 font-semibold">Score Breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#1b6ef3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-5">
          <h3 className="mb-4 font-semibold">Skill Gap</h3>
          <TagList title="Matched" items={analysis.matchedSkills} tone="mint" />
          <TagList title="Missing" items={analysis.missingSkills} tone="coral" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Insight title="Strengths" items={analysis.strengths} />
        <Insight title="Weaknesses" items={analysis.weaknesses} />
        <Insight title="Suggestions" items={analysis.suggestions} />
      </div>
    </section>
  );
}

function TagList({ title, items = [], tone }) {
  const color = tone === "mint" ? "bg-mint/10 text-mint" : "bg-coral/10 text-coral";
  return (
    <div className="mb-5">
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.length ? items.map((item) => <span className={`rounded-md px-2 py-1 text-xs font-semibold ${color}`} key={item}>{item}</span>) : <span className="text-sm text-slate-500">None detected</span>}
      </div>
    </div>
  );
}

function Insight({ title, items = [] }) {
  return (
    <div className="panel p-5">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <ul className="space-y-3 text-sm leading-6 text-slate-600">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
