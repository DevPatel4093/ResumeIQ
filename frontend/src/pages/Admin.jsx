import { useEffect, useState } from "react";
import { FiBarChart2, FiFileText, FiUsers } from "react-icons/fi";
import StatCard from "../components/StatCard.jsx";
import { api } from "../services/api.js";

export default function Admin() {
  const [stats, setStats] = useState({ users: 0, resumes: 0, reports: 0, avgScore: 0 });
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/admin/stats"), api.get("/admin/users"), api.get("/admin/reports")])
      .then(([statsRes, usersRes, reportsRes]) => {
        setStats(statsRes.data);
        setUsers(usersRes.data.users);
        setReports(reportsRes.data.reports);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Monitor users, uploaded resumes, reports, and average ATS quality.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={FiUsers} label="Users" value={stats.users} />
        <StatCard icon={FiFileText} label="Resumes" value={stats.resumes} tone="mint" />
        <StatCard icon={FiBarChart2} label="Reports" value={stats.reports} tone="coral" />
        <StatCard icon={FiBarChart2} label="Average ATS" value={stats.avgScore} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Table title="Users" rows={users.map((user) => [user.name, user.email, user.role])} headers={["Name", "Email", "Role"]} />
        <Table title="Recent Reports" rows={reports.map((item) => [item.jobTitle, `${item.atsScore}/100`, item.rating])} headers={["Role", "Score", "Rating"]} />
      </div>
    </section>
  );
}

function Table({ title, headers, rows }) {
  return (
    <div className="panel overflow-hidden">
      <h2 className="border-b border-slate-200 p-4 font-semibold">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>{headers.map((header) => <th className="px-4 py-3" key={header}>{header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length ? rows.map((row, index) => (
              <tr key={index}>{row.map((cell, idx) => <td className="px-4 py-3" key={idx}>{cell}</td>)}</tr>
            )) : <tr><td className="px-4 py-3 text-slate-500" colSpan={headers.length}>No data yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
