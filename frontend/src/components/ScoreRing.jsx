export default function ScoreRing({ score = 0, label = "ATS Score" }) {
  const angle = Math.max(0, Math.min(score, 100)) * 3.6;
  return (
    <div className="grid place-items-center">
      <div
        className="grid h-36 w-36 place-items-center rounded-full"
        style={{ background: `conic-gradient(#1b6ef3 ${angle}deg, #e5e7eb 0deg)` }}
      >
        <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center">
          <div>
            <div className="text-3xl font-bold">{score}</div>
            <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
