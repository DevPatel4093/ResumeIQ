import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiBarChart2, FiFileText, FiHome, FiLogOut, FiShield, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = [
    ["Dashboard", "/dashboard", FiHome],
    ["Analyze", "/analyze", FiFileText],
    ["History", "/history", FiBarChart2],
    ["Profile", "/profile", FiUser]
  ];
  if (user?.role === "admin") links.push(["Admin", "/admin", FiShield]);

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 md:block">
        <h1 className="text-xl font-bold">ResumeIQ</h1>
        <p className="mt-1 text-sm text-slate-500">AI Resume Analyzer</p>
        <nav className="mt-8 space-y-1">
          {links.map(([label, href, Icon]) => (
            <NavLink key={href} to={href} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${isActive ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>
        <button
          className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <FiLogOut /> Logout
        </button>
      </aside>
      <main className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <p className="font-semibold">{user?.name}</p>
            </div>
            <nav className="flex gap-2 md:hidden">
              {links.slice(0, 3).map(([label, href, Icon]) => (
                <NavLink key={href} aria-label={label} to={href} className="grid h-10 w-10 place-items-center rounded-md bg-slate-100">
                  <Icon />
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
