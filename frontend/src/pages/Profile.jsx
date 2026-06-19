import { FiMail, FiShield, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Account details used for protected analysis history.</p>
      </div>
      <div className="panel max-w-2xl p-6">
        <div className="grid h-16 w-16 place-items-center rounded-lg bg-brand/10 text-2xl text-brand">
          <FiUser />
        </div>
        <dl className="mt-6 space-y-4">
          <Row icon={FiUser} label="Name" value={user?.name} />
          <Row icon={FiMail} label="Email" value={user?.email} />
          <Row icon={FiShield} label="Role" value={user?.role} />
        </dl>
      </div>
    </section>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-md bg-slate-50 p-3">
      <Icon className="text-brand" />
      <div>
        <dt className="text-xs font-semibold uppercase text-slate-500">{label}</dt>
        <dd className="font-semibold capitalize">{value}</dd>
      </div>
    </div>
  );
}
