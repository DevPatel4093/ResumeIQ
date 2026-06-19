import { useEffect, useState } from "react";
import { FiFilePlus, FiPlay } from "react-icons/fi";
import AnalysisReport from "../components/AnalysisReport.jsx";
import { api, getError } from "../services/api.js";

export default function Analyze() {
  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/resume/all").then(({ data }) => setResumes(data.resumes)).catch(() => {});
  }, []);

  async function uploadResume() {
    if (!file) return setMessage("Choose a PDF or DOCX resume first.");
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const { data } = await api.post("/resume/upload", formData);
      setResume(data.resume);
      setResumes([data.resume, ...resumes]);
    } catch (err) {
      setMessage(getError(err));
    } finally {
      setLoading(false);
    }
  }

  async function runAnalysis() {
    const selected = resume || resumes[0];
    if (!selected || !jobDescription.trim()) return setMessage("Upload or select a resume and paste a job description.");
    setLoading(true);
    setMessage("");
    try {
      const { data } = await api.post("/analyze", { resumeId: selected.id || selected._id, jobDescription, jobTitle });
      setAnalysis(data.analysis);
    } catch (err) {
      setMessage(getError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analyze Resume</h1>
        <p className="mt-1 text-sm text-slate-500">Upload a resume, paste the job description, and generate an ATS report.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <div className="panel p-5">
            <h2 className="mb-4 font-semibold">Resume Upload</h2>
            <label className="grid cursor-pointer place-items-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <FiFilePlus className="mb-3 text-3xl text-brand" />
              <span className="text-sm font-semibold">{file ? file.name : "Drop or choose PDF/DOCX"}</span>
              <input className="hidden" type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} />
            </label>
            <button className="btn-secondary mt-4 w-full" disabled={loading} onClick={uploadResume}>Upload & Parse</button>
            {resumes.length > 0 && (
              <select className="input mt-4" value={(resume || resumes[0]).id || (resume || resumes[0])._id} onChange={(e) => setResume(resumes.find((item) => (item.id || item._id) === e.target.value))}>
                {resumes.map((item) => <option key={item.id || item._id} value={item.id || item._id}>{item.fileName}</option>)}
              </select>
            )}
            {(resume || resumes[0])?.parsed && <ParsedPreview parsed={(resume || resumes[0]).parsed} />}
          </div>
        </div>
        <div className="panel p-5">
          <h2 className="mb-4 font-semibold">Job Requirements</h2>
          {message && <p className="mb-4 rounded-md bg-coral/10 p-3 text-sm text-coral">{message}</p>}
          <input className="input mb-4" placeholder="Job title, e.g. Full Stack Developer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          <textarea className="input min-h-72" placeholder="Paste job description and requirements here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
          <button className="btn-primary mt-4" disabled={loading} onClick={runAnalysis}><FiPlay /> Generate Analysis</button>
        </div>
      </div>
      <AnalysisReport analysis={analysis} />
    </section>
  );
}

function ParsedPreview({ parsed }) {
  return (
    <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm">
      <p className="font-semibold">{parsed.name}</p>
      <p className="text-slate-500">{parsed.email || "No email detected"} {parsed.phone ? `• ${parsed.phone}` : ""}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(parsed.skills || []).map((skill) => <span className="rounded-md bg-brand/10 px-2 py-1 text-xs font-semibold text-brand" key={skill}>{skill}</span>)}
      </div>
    </div>
  );
}
