import {
  formatDate,
  getDayName,
  getStatus,
  statusStyles,
} from "../utils/DisplayMonthlyAttendanceHelpers";
import type { ReturnType, Day } from "../utils/resolveClassAttendance";

type Props = {
  data: ReturnType | null;
};

function DayCard({ day, index }: { day: Day; index: number }) {
  const status = getStatus(day);
  const styles = statusStyles[status];

  let countLabel: string;
  if (status === "present") countLabel = String(day.presentCount);
  else if (status === "absent") countLabel = "0";
  else if (status === "holiday") countLabel = "hol";
  else countLabel = "—";

  return (
    <div
      className={`
        flex flex-row sm:flex-col
        items-center sm:items-center
        justify-between sm:justify-start
        gap-2 sm:gap-1.5
        rounded-xl border
        px-4 py-3 sm:py-3 sm:px-1
        transition-transform duration-150 hover:scale-[1.02] cursor-default
        ${styles.cell}
      `}
    >
      <div className="flex items-center gap-2 sm:flex-col sm:gap-1.5 sm:items-center">
        <span className="text-[10px] font-semibold text-white/25 uppercase tracking-widest w-8 sm:w-auto text-center">
          {getDayName(index)}
        </span>
        <span className="text-lg sm:text-xl font-black text-white/70 leading-none">
          {formatDate(day.date)}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:flex-col sm:gap-1.5 sm:items-center">
        <div
          className={`w-1.5 h-1.5 rounded-full hidden sm:block ${styles.dot}`}
        />
        <span className={`text-sm sm:text-xs font-bold ${styles.count}`}>
          {countLabel}
        </span>
        <div className={`w-1.5 h-1.5 rounded-full sm:hidden ${styles.dot}`} />
      </div>
    </div>
  );
}

function WeeklySummary({ data }: { data: ReturnType }) {
  const classDays = data?.days?.filter(
    (d) => d.hasClass && !d.isHoliday && !d.isSunday,
  );
  const presentDays = classDays?.filter((d) => (d.presentCount ?? 0) > 0);
  const holidays = data?.days?.filter((d) => d.isHoliday).length;
  const pct =
    classDays?.length > 0
      ? Math.round((presentDays.length / classDays.length) * 100)
      : 0;

  const pctColor =
    pct >= 75
      ? "text-emerald-400"
      : pct >= 50
        ? "text-amber-400"
        : "text-red-400";

  const progressColor =
    pct >= 75 ? "bg-emerald-400" : pct >= 50 ? "bg-amber-400" : "bg-red-400";

  const metrics = [
    {
      label: `Week ${data.weekNumber}`,
      value: `${pct}%`,
      sub: "attendance rate",
      valueColor: pctColor,
    },
    {
      label: "Present",
      value: String(presentDays?.length),
      sub: `of ${classDays?.length} days`,
      valueColor: "text-white/85",
    },
    {
      label: "Holidays",
      value: String(holidays),
      sub: "this week",
      valueColor: "text-amber-400",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4"
          >
            <p className="text-[10px] sm:text-[11px] text-white/30 uppercase tracking-widest mb-1 sm:mb-1.5 truncate">
              {m.label}
            </p>
            <p
              className={`text-2xl sm:text-3xl font-black leading-none ${m.valueColor}`}
            >
              {m.value}
            </p>
            <p className="text-[10px] sm:text-[11px] text-white/25 mt-1">
              {m.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-xs font-bold tabular-nums ${pctColor}`}>
          {pct}%
        </span>
      </div>
    </>
  );
}

const DisplayWeeklyAttendance = ({ data }: Props) => {
  if (!data) return null;

  return (
    <div>
      <WeeklySummary data={data} />

      <div className="flex gap-3 sm:gap-4 mb-4 flex-wrap">
        {(
          [
            ["Present", "bg-emerald-400"],
            ["Absent", "bg-red-400"],
            ["Holiday", "bg-amber-400"],
            ["No class", "bg-white/15"],
          ] as [string, string][]
        ).map(([label, dot]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            <span className="text-[11px] text-white/30">{label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white/4 border border-white/8 rounded-2xl px-3 sm:px-4 py-4">
        <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-3 sm:mb-4">
          Week {data.weekNumber} — daily breakdown
        </p>

        <div className="flex flex-col gap-2 sm:hidden">
          {data?.days?.map((day, idx) => (
            <DayCard key={idx} day={day} index={idx} />
          ))}
        </div>

        <div className="hidden sm:grid sm:grid-cols-7 gap-2">
          {data?.days?.map((day, idx) => (
            <DayCard key={idx} day={day} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayWeeklyAttendance;
