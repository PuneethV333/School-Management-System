const GradePill = ({ label }: { label: string }) => (
  <span
    className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-black border ${
      label === "A+" || label === "A"
        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
        : label === "B"
        ? "border-sky-500/40 bg-sky-500/10 text-sky-300"
        : label === "C"
        ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
        : label === "D"
        ? "border-orange-500/40 bg-orange-500/10 text-orange-300"
        : "border-red-500/40 bg-red-500/10 text-red-400"
    }`}
  >
    {label}
  </span>
);


export default GradePill