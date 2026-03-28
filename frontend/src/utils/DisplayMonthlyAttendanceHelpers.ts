import type { Day } from "./resolveClassAttendance";

export type DayStatus = "present" | "absent" | "holiday" | "noclass";

export const statusStyles: Record<DayStatus, { cell: string; dot: string; count: string; label: string }> = {
  present: {
    cell: "bg-emerald-950/40 border-emerald-700/40 hover:border-emerald-500/60",
    dot: "bg-emerald-400",
    count: "text-emerald-400 font-semibold",
    label: "Present",
  },
  absent: {
    cell: "bg-red-950/40 border-red-700/40 hover:border-red-500/60",
    dot: "bg-red-400",
    count: "text-red-400 font-semibold",
    label: "Absent",
  },
  holiday: {
    cell: "bg-amber-950/40 border-amber-700/40 hover:border-amber-500/60",
    dot: "bg-amber-400",
    count: "text-amber-400 font-medium",
    label: "Holiday",
  },
  noclass: {
    cell: "bg-white/[0.03] border-white/10 hover:border-white/20",
    dot: "bg-white/20",
    count: "text-white/20",
    label: "No class",
  },
};

export function getStatus(day: Day): DayStatus {
  if (day.isSunday || (!day.hasClass && !day.isHoliday)) return "noclass";
  if (day.isHoliday) return "holiday";
  if (day.presentCount === 0) return "absent";
  return "present";
}

export function getDayName(index: number): string {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index % 7];
}

export function formatDate(dateStr: string): number {
  return new Date(dateStr).getDate();
}