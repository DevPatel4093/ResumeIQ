import { useEffect, useState } from "react";
import AnalysisReport from "../components/AnalysisReport.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";

export default function History() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const endpoint = user?.role === "admin" ? "/admin/reports" : "/analyze/history";
    const key = user?.role === "admin" ? "reports" : "analyses";

    api.get(endpoint).then(({ data }) => {
      const items = data[key] || [];
      setAnalyses(items);
      setSelected(items[0] || null);
    }).catch(() => {
      setAnalyses([]);
      setSelected(null);
    });
  }, [user?.role]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analysis History</h1>
        <p className="mt-1 text-sm text-slate-500">
          {user?.role === "admin" ? "Review all generated reports across users." : "Review previous reports and download summaries."}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="panel divide-y divide-slate-200 overflow-hidden">
          {analyses.length ? analyses.map((item) => (
            <button
              className={`block w-full p-4 text-left ${selected?.id === item.id || selected?._id === item._id ? "bg-brand/10" : "hover:bg-slate-50"}`}
              key={item.id || item._id}
              onClick={() => setSelected(item)}
            >
              <p className="font-semibold">{item.jobTitle}</p>
              <p className="text-sm text-slate-500">{item.atsScore}/100 • {item.rating}</p>
            </button>
          )) : <p className="p-5 text-sm text-slate-500">No reports yet.</p>}
        </div>
        <AnalysisReport analysis={selected} />
      </div>
    </section>
  );
}
