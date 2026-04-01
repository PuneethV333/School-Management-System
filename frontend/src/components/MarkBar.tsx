const MarkBar = ({
  marks,
  maxMarks,
}: {
  marks: number;
  maxMarks: number;
}) => {
  const pct = Math.min((marks / maxMarks) * 100, 100);
  const color =
    pct >= 80
      ? "bg-emerald-400"
      : pct >= 60
      ? "bg-sky-400"
      : pct >= 40
      ? "bg-amber-400"
      : "bg-red-400";

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-bold text-white tabular-nums w-8 text-right">
        {marks}
      </span>
      <span className="text-xs text-slate-500 tabular-nums">/{maxMarks}</span>
    </div>
  );
};

export default MarkBar