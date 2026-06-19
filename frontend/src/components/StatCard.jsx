export default function StatCard({ icon: Icon, label, value, tone = "brand" }) {
  const toneClass = tone === "mint" ? "bg-mint/10 text-mint" : tone === "coral" ? "bg-coral/10 text-coral" : "bg-brand/10 text-brand";
  return (
    <div className="panel p-5">
      <div className={`mb-4 grid h-10 w-10 place-items-center rounded-md ${toneClass}`}>
        <Icon />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
