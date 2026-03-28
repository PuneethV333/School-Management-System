import {
  formatDate,
  getDayName,
  getStatus,
  statusStyles,
} from "../utils/DisplayMonthlyAttendanceHelpers";
import type { Day } from "../utils/resolveClassAttendance";
import type { returnType } from "../utils/returnMonthsData";

type Props = {
  data: returnType | null;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function DayCell({ day, index }: { day: Day; index: number }) {
  const status = getStatus(day);
  const styles = statusStyles[status];

  let countLabel: string;
  if (status === "present") countLabel = String(day.presentCount);
  else if (status === "absent") countLabel = "0";
  else if (status === "holiday") countLabel = "hol";
  else countLabel = "—";

  return (
    <>
      <div
        className={`
          flex sm:hidden flex-row items-center justify-between
          rounded-xl border px-4 py-3
          transition-transform duration-150 hover:scale-[1.02] cursor-default
          ${styles.cell}
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-white/25 uppercase tracking-widest w-7">
            {getDayName(index)}
          </span>
          <span className="text-lg font-black text-white/70 leading-none">
            {formatDate(day.date)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${styles.count}`}>
            {countLabel}
          </span>
          <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
        </div>
      </div>

      <div
        className={`
          hidden sm:flex flex-col items-center gap-1.5
          rounded-xl border py-3 px-1
          transition-transform duration-150 hover:scale-105 cursor-default
          ${styles.cell}
        `}
      >
        <span className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">
          {getDayName(index)}
        </span>
        <span className="text-lg font-black text-white/70 leading-none">
          {formatDate(day.date)}
        </span>
        <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
        <span className={`text-xs font-bold ${styles.count}`}>
          {countLabel}
        </span>
      </div>
    </>
  );
}

function SummaryBar({ data }: { data: returnType }) {
  let totalClasses = 0;
  let totalPresent = 0;
  let holidays = 0;

  data?.weeks?.forEach((w) =>
    w.days.forEach((d) => {
      if (d.hasClass && !d.isHoliday && !d.isSunday) {
        totalClasses++;
        if ((d.presentCount ?? 0) > 0) totalPresent++;
      }
      if (d.isHoliday) holidays++;
    }),
  );

  const pct =
    totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
  const monthName = MONTH_NAMES[(data.monthNumber - 1) % 12];

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
      label: monthName,
      value: `${pct}%`,
      sub: "attendance rate",
      valueColor: pctColor,
    },
    {
      label: "Present",
      value: String(totalPresent),
      sub: `of ${totalClasses} days`,
      valueColor: "text-white/85",
    },
    {
      label: "Holidays",
      value: String(holidays),
      sub: "this month",
      valueColor: "text-amber-400",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
        {metrics?.map((m) => (
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

const DisplayMonthlyAttendance = ({ data }: Props) => {
  if (!data) return null;

  return (
    <div>
      <SummaryBar data={data} />

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

      <div className="flex flex-col gap-3 sm:gap-4">
        {data?.weeks?.map((week, wIdx) => (
          <div
            key={wIdx}
            className="bg-white/4 border border-white/8 rounded-2xl px-3 sm:px-4 py-4"
          >
            <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-3 sm:mb-4">
              Week {week.weekNumber}
            </p>

            <div className="flex flex-col gap-2 sm:hidden">
              {week?.days?.map((day, dIdx) => (
                <DayCell key={dIdx} day={day} index={dIdx} />
              ))}
            </div>

            <div className="hidden sm:grid sm:grid-cols-7 gap-2">
              {week?.days?.map((day, dIdx) => (
                <DayCell key={dIdx} day={day} index={dIdx} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayMonthlyAttendance;
