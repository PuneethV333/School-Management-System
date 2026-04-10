/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { returnType } from "../utils/returnMonthsData";

interface AttendanceProps {
  classAttendance: {
    totalStudents: number;
    months: returnType[];
  };
  dataType: "weekly" | "monthly";
}

interface WeeklyDataPoint {
  day: string;
  present: number;
  total: number;
  percentage: number;
  date: string;
  isHoliday: boolean;
}

interface MonthlyDataPoint {
  week: string;
  avgPresent: number;
  total: number;
  percentage: number;
  daysCount: number;
}

export const Attendance = ({ classAttendance, dataType }: AttendanceProps) => {
  const processWeeklyData = useMemo(() => {
    if (!classAttendance?.months) return [];

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDate = today.getDate();

    const monthData = classAttendance.months.find(
      (m) => m.monthNumber === currentMonth,
    );

    if (!monthData?.weeks) return [];

    let currentWeek = null;
    for (const week of monthData.weeks) {
      for (const day of week.days) {
        const dayDate = new Date(day.date).getDate();
        if (dayDate === currentDate) {
          currentWeek = week;
          break;
        }
      }
      if (currentWeek) break;
    }

    if (!currentWeek) {
      currentWeek = monthData.weeks[monthData.weeks.length - 1];
    }

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyData: WeeklyDataPoint[] = currentWeek.days.map((day, index) => {
      const date = new Date(day.date);
      const dayName = dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1];

      return {
        day: dayName,
        present: day.presentCount || 0,
        total: classAttendance.totalStudents,
        percentage: day.presentCount
          ? Math.round((day.presentCount / classAttendance.totalStudents) * 100)
          : 0,
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        isHoliday: day.isHoliday || day.isSunday,
      };
    });

    return weeklyData;
  }, [classAttendance, dataType]);

  const processMonthlyData = useMemo(() => {
    if (!classAttendance?.months) return [];

    const today = new Date();
    const currentMonth = today.getMonth() + 1;

    const monthData = classAttendance.months.find(
      (m) => m.monthNumber === currentMonth,
    );

    if (!monthData?.weeks) return [];

    const monthlyData: MonthlyDataPoint[] = monthData.weeks.map((week) => {
      const validDays = week.days.filter(
        (day) => day.hasClass && day.presentCount !== null,
      );
      const totalPresent = validDays.reduce(
        (sum, day) => sum + (day.presentCount || 0),
        0,
      );
      const avgPresent =
        validDays.length > 0 ? Math.round(totalPresent / validDays.length) : 0;

      return {
        week: `Week ${week.weekNumber}`,
        avgPresent,
        total: classAttendance.totalStudents,
        percentage: avgPresent
          ? Math.round((avgPresent / classAttendance.totalStudents) * 100)
          : 0,
        daysCount: validDays.length,
      };
    });

    return monthlyData;
  }, [classAttendance, dataType]);

  const data = dataType === "weekly" ? processWeeklyData : processMonthlyData;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isWeekly = dataType === "weekly";

      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 shadow-2xl shadow-cyan-500/20">
          <p className="text-cyan-400 font-bold text-sm mb-2">
            {isWeekly ? `${data.day} - ${data.date}` : data.week}
          </p>
          {isWeekly && data.isHoliday ? (
            <p className="text-slate-400 text-xs">Holiday / No Class</p>
          ) : (
            <>
              <div className="flex justify-between gap-4 mb-1">
                <span className="text-slate-300 text-xs">Present:</span>
                <span className="text-emerald-400 font-semibold text-xs">
                  {isWeekly ? data.present : data.avgPresent}
                </span>
              </div>
              <div className="flex justify-between gap-4 mb-1">
                <span className="text-slate-300 text-xs">Total:</span>
                <span className="text-slate-400 font-semibold text-xs">
                  {data.total}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-300 text-xs">Rate:</span>
                <span className="text-cyan-400 font-bold text-xs">
                  {data.percentage}%
                </span>
              </div>
              {!isWeekly && (
                <div className="flex justify-between gap-4 mt-1 pt-1 border-t border-slate-700">
                  <span className="text-slate-300 text-xs">Days:</span>
                  <span className="text-slate-400 font-semibold text-xs">
                    {data.daysCount}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const getBarColor = (percentage: number, isHoliday?: boolean) => {
    if (isHoliday) return "#475569";
    if (percentage >= 90) return "#10b981";
    if (percentage >= 75) return "#06b6d4";
    if (percentage >= 60) return "#f59e0b";
    return "#ef4444";
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-slate-400">
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-lg font-semibold">No attendance data available</p>
          <p className="text-sm text-slate-500 mt-2">
            Check back once attendance is recorded
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-1">
          Attendance Overview
        </h2>
        <p className="text-slate-400 text-sm">
          {dataType === "weekly"
            ? "Current week attendance"
            : "Monthly attendance trends"}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={[data]}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="excellentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="goodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#0891b2" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="averageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="poorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            strokeOpacity={0.3}
            vertical={false}
          />

          <XAxis
            dataKey={dataType === "weekly" ? "day" : "week"}
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
            tickLine={{ stroke: "#475569" }}
            axisLine={{ stroke: "#475569" }}
          />

          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
            tickLine={{ stroke: "#475569" }}
            axisLine={{ stroke: "#475569" }}
            domain={[0, classAttendance.totalStudents]}
            label={{
              value: "Students",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#94a3b8", fontSize: 12, fontWeight: 600 },
            }}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "#1e293b", opacity: 0.5 }}
          />

          <Bar
            dataKey={dataType === "weekly" ? "present" : "avgPresent"}
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          >
            {data.map((entry, index) => {
              const percentage = entry.percentage;
              const isHoliday =
                dataType === "weekly" && (entry as WeeklyDataPoint).isHoliday;
              let fill;

              if (isHoliday) {
                fill = "#475569";
              } else if (percentage >= 90) {
                fill = "url(#excellentGradient)";
              } else if (percentage >= 75) {
                fill = "url(#goodGradient)";
              } else if (percentage >= 60) {
                fill = "url(#averageGradient)";
              } else {
                fill = "url(#poorGradient)";
              }

              return <Cell key={`cell-${index}`} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-b from-emerald-500 to-emerald-600"></div>
          <span className="text-slate-300 text-xs font-medium">
            Excellent (90%+)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-b from-cyan-500 to-cyan-600"></div>
          <span className="text-slate-300 text-xs font-medium">
            Good (75-89%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-b from-amber-500 to-amber-600"></div>
          <span className="text-slate-300 text-xs font-medium">
            Average (60-74%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-b from-red-500 to-red-600"></div>
          <span className="text-slate-300 text-xs font-medium">
            Needs Attention (&lt;60%)
          </span>
        </div>
        {dataType === "weekly" && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-600"></div>
            <span className="text-slate-300 text-xs font-medium">Holiday</span>
          </div>
        )}
      </div>
    </div>
  );
};
