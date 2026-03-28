type DayStatus = "present" | "absent" | "holiday" | "noclass";

export const statusStyles: Record<
  DayStatus,
  { cell: string; dot: string; count: string; label: string }
> = {
  present: {
    cell: "bg-emerald-950/60 border-emerald-700/50 hover:border-emerald-500/70",
    dot: "bg-emerald-400",
    count: "text-emerald-400 font-semibold",
    label: "Present",
  },
  absent: {
    cell: "bg-red-950/60 border-red-700/50 hover:border-red-500/70",
    dot: "bg-red-400",
    count: "text-red-400 font-semibold",
    label: "Absent",
  },
  holiday: {
    cell: "bg-amber-950/60 border-amber-700/50 hover:border-amber-500/70",
    dot: "bg-amber-400",
    count: "text-amber-400 font-medium",
    label: "Holiday",
  },
  noclass: {
    cell: "bg-slate-800/60 border-slate-700/40 hover:border-slate-600/60",
    dot: "bg-slate-600",
    count: "text-slate-500",
    label: "No class",
  },
};
