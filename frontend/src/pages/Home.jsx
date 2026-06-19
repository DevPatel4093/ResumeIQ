import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2, FiCheckCircle, FiFileText } from "react-icons/fi";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <section className="grid min-h-[88vh] items-center px-6 py-10 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_460px] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-brand">AI-Powered Resume Analyzer</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">ResumeIQ</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Upload a resume, paste a job description, and get ATS scoring, missing skills, strengths, weaknesses, and practical improvements in one report.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary">Start analyzing <FiArrowRight /></Link>
              <Link to="/login" className="btn-secondary">Login</Link>
            </div>
          </div>
          <div className="panel p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Sample ATS score</p>
                <p className="text-4xl font-bold">87</p>
              </div>
              <FiBarChart2 className="text-4xl text-brand" />
            </div>
            {[
              ["React, Node.js, MongoDB matched", FiCheckCircle],
              ["Docker and AWS missing", FiFileText],
              ["Add measurable project impact", FiArrowRight]
            ].map(([text, Icon]) => (
              <div key={text} className="mb-3 flex items-center gap-3 rounded-md bg-slate-50 p-3 text-sm font-semibold">
                <Icon className="text-brand" /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {["ATS compatibility", "Skill gap analysis", "Report history"].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 p-5">
              <h2 className="font-semibold">{item}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Built for candidates and recruiters who need fast, explainable resume matching.</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
