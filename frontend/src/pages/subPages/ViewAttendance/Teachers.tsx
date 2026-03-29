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
      teacher.name.toLowerCase().includes(searchTeacherName.toLowerCase())
    );
  }, [res, searchTeacherName]);

  if (loading || teachersAttendanceLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-6 sm:py-8 lg:py-10 overflow-x-hidden flex">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Teachers
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Attendance overview for all teachers
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between mb-6">
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTeacherName}
              onChange={(e) => setSearchTeacherName(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
            />
          </div>

          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-700/60">
                <th className="py-3 px-4 text-slate-400 font-medium">#</th>
                <th className="py-3 px-4 text-slate-400 font-medium">Name</th>
                <th className="py-3 px-4 text-slate-400 font-medium">Today</th>
                <th className="py-3 px-4 text-slate-400 font-medium">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody>
              {filterTeachers?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-slate-500">
                    No teachers found
                  </td>
                </tr>
              ) : (
                filterTeachers?.map((x, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-500">{idx + 1}</td>

                    <td className="py-3 px-4 text-slate-100 font-medium">
                      {x.name}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          x.isPresentToday
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-red-400/10 text-red-400"
                        }`}
                      >
                        {x.isPresentToday ? "Present" : "Absent"}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-slate-700/60 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all"
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
                          className={`text-sm font-semibold ${
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
        </div>
      </div>
    </div>
  );
};

export default Teachers;