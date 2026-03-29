import { useMemo, useState } from "react";
import Spinner from "../../../components/Spinner";
import { useFetchTeachersAttendance } from "../../../hooks/useAttendanceData";
import { useFetchMe } from "../../../hooks/useAuth";
import { resolveTeacherAttendance } from "../../../utils/resolveTeacherAttendance";

const Teachers = () => {
  const { data: userData, isPending: loading } = useFetchMe();
  const { data: teachersAttendance, isPending: teachersAttendanceLoading } =
    useFetchTeachersAttendance(userData);
  const [searchTeacherName, setSearchTeacherName] = useState<string>("");
  const res = resolveTeacherAttendance(teachersAttendance);

  const filterTeachers = useMemo(() => {
    return res?.filter((teacher) =>
      teacher.name.toLowerCase().includes(searchTeacherName.toLowerCase()),
    );
  }, [res, searchTeacherName]);

  if (loading || teachersAttendanceLoading) {
    return <Spinner />;
  }

  const presentCount =
    filterTeachers?.filter((t) => t.isPresentToday).length ?? 0;
  const totalCount = filterTeachers?.length ?? 0;
  const absentCount = totalCount - presentCount;
  const avgAttendance =
    totalCount > 0
      ? Math.round(
          (filterTeachers?.reduce(
            (sum, t) => sum + t.attendancePercentage,
            0,
          ) ?? 0) / totalCount,
        )
      : 0;

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-8 lg:py-12 overflow-x-hidden">
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-cyan-500 mb-2">
              Attendance Dashboard
            </p>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-none tracking-tight">
              Teachers
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-emerald-400">
                .
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              {totalCount} teachers enrolled
            </p>
          </div>

          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTeacherName}
              onChange={(e) => setSearchTeacherName(e.target.value)}
              className="bg-slate-800/80 border border-slate-700/60 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 w-60 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 placeholder-slate-600 transition-all"
            />
            {searchTeacherName && (
              <button
                onClick={() => setSearchTeacherName("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: "Total",
              value: totalCount,
              color: "text-slate-100",
              bg: "bg-slate-800/60",
              border: "border-slate-700/40",
              dot: null,
            },
            {
              label: "Present",
              value: presentCount,
              color: "text-emerald-400",
              bg: "bg-emerald-400/5",
              border: "border-emerald-400/20",
              dot: "bg-emerald-400",
            },
            {
              label: "Absent",
              value: absentCount,
              color: "text-red-400",
              bg: "bg-red-400/5",
              border: "border-red-400/20",
              dot: "bg-red-400",
            },
            {
              label: "Avg. Attendance",
              value: `${avgAttendance}%`,
              color:
                avgAttendance >= 75
                  ? "text-emerald-400"
                  : avgAttendance >= 50
                    ? "text-amber-400"
                    : "text-red-400",
              bg: "bg-slate-800/60",
              border: "border-slate-700/40",
              dot: null,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} border ${stat.border} rounded-2xl p-4 flex flex-col gap-1`}
            >
              <div className="flex items-center gap-1.5">
                {stat.dot && (
                  <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                )}
                <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                  {stat.label}
                </span>
              </div>
              <span className={`text-3xl font-black ${stat.color}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/80 border border-slate-700/40 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 backdrop-blur-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <span className="text-slate-400 text-xs font-medium">
              Showing{" "}
              <span className="text-slate-200 font-semibold">
                {filterTeachers?.length ?? 0}
              </span>{" "}
              {searchTeacherName ? "results" : "teachers"}
            </span>
          </div>

          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="py-3 px-5 text-slate-500 font-medium text-xs uppercase tracking-wider w-12">
                  #
                </th>
                <th className="py-3 px-5 text-slate-500 font-medium text-xs uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-5 text-slate-500 font-medium text-xs uppercase tracking-wider">
                  Today
                </th>
                <th className="py-3 px-5 text-slate-500 font-medium text-xs uppercase tracking-wider">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody>
              {filterTeachers?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 text-xl">
                        🔍
                      </div>
                      <p className="text-slate-500 text-sm">
                        No teachers found
                        {searchTeacherName && (
                          <span>
                            {" "}
                            for{" "}
                            <span className="text-slate-300 font-medium">
                              "{searchTeacherName}"
                            </span>
                          </span>
                        )}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filterTeachers?.map((x, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-800/70 hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3.5 px-5 text-slate-600 text-xs font-mono">
                      {String(idx + 1).padStart(2, "0")}
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                          {x.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-100 font-medium group-hover:text-white transition-colors">
                          {x.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          x.isPresentToday
                            ? "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20"
                            : "bg-red-400/10 text-red-400 ring-1 ring-red-400/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            x.isPresentToday ? "bg-emerald-400" : "bg-red-400"
                          }`}
                        />
                        {x.isPresentToday ? "Present" : "Absent"}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${x.attendancePercentage}%`,
                              backgroundColor:
                                x.attendancePercentage >= 75
                                  ? "#34d399"
                                  : x.attendancePercentage >= 50
                                    ? "#fbbf24"
                                    : "#f87171",
                            }}
                          />
                        </div>
                        <span
                          className={`text-sm font-bold tabular-nums ${
                            x.attendancePercentage >= 75
                              ? "text-emerald-400"
                              : x.attendancePercentage >= 50
                                ? "text-amber-400"
                                : "text-red-400"
                          }`}
                        >
                          {x.attendancePercentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {(filterTeachers?.length ?? 0) > 0 && (
            <div className="px-5 py-3 border-t border-slate-800 flex justify-end">
              <span className="text-xs text-slate-600">
                {filterTeachers?.length} of {res?.length} teachers
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teachers;
