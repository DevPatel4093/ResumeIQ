import { useEffect, useMemo, useState } from "react";
import { FiActivity, FiFileText, FiTarget } from "react-icons/fi";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import StatCard from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";

export default function Dashboard() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [adminStats, setAdminStats] = useState(null);

  useEffect(() => {
    if (user?.role === "admin") {
      Promise.all([api.get("/admin/stats"), api.get("/admin/reports")])
        .then(([statsRes, reportsRes]) => {
          setAdminStats(statsRes.data);
          setAnalyses(reportsRes.data.reports);
        })
        .catch(() => {
          setAdminStats(null);
          setAnalyses([]);
        });
      return;
    }

    api.get("/analyze/history")
      .then(({ data }) => setAnalyses(data.analyses))
      .catch(() => setAnalyses([]));
  }, [user?.role]);

  const avgScore = useMemo(() => {
    if (!analyses.length) return 0;
    return Math.round(analyses.reduce((sum, item) => sum + item.atsScore, 0) / analyses.length);
  }, [analyses]);

  const chart = analyses.slice().reverse().map((item, index) => ({ name: `#${index + 1}`, score: item.atsScore }));
  const reportsCount = adminStats?.reports ?? analyses.length;
  const averageScore = adminStats?.avgScore ?? avgScore;
  const bestScore = Math.max(0, ...analyses.map((item) => item.atsScore));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          {user?.role === "admin" ? "Monitor overall resume analysis activity." : "Track resume fit and improvement over time."}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={FiFileText} label="Reports" value={reportsCount} />
        <StatCard icon={FiTarget} label="Average ATS" value={averageScore} tone="mint" />
        <StatCard icon={FiActivity} label="Best Score" value={bestScore} tone="coral" />
      </div>
      <div className="panel p-5">
        <h2 className="mb-4 font-semibold">ATS Score Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#1b6ef3" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
