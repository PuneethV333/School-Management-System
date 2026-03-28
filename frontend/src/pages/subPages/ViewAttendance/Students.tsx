import { useState } from "react";
import Spinner from "../../../components/Spinner";
import { useFetchStudentsAttendanceAccClass } from "../../../hooks/useAttendanceData";
import { useFetchMe } from "../../../hooks/useAuth";
import SelectClass from "../../../components/SelectClass";
import { resolveStudentAttendance } from "../../../utils/resolveStudentAttendance";

const Students = () => {
  const { data: userData, isPending: loading } = useFetchMe();
  const [classNo, setClassNo] = useState<number>(3);

  const {
    data: classStudentsAttendance,
    isPending: studentsAttendanceLoading,
  } = useFetchStudentsAttendanceAccClass(userData, classNo);

  if (loading || studentsAttendanceLoading) {
    return <Spinner />;
  }

  const res = resolveStudentAttendance(classStudentsAttendance);

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-6 sm:py-8 lg:py-10 overflow-x-hidden flex">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Students
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Attendance overview for all students in the selected class
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between mb-6">
            <span className="text-slate-300 text-sm font-medium">
              {res?.length ?? 0} student{res?.length !== 1 ? "s" : ""}
            </span>
            <SelectClass classNo={classNo} setClassNo={setClassNo} />
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
              {res?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-slate-500">
                    No students found for this class
                  </td>
                </tr>
              ) : (
                res?.map((x, idx) => (
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
                                  ? "#34d399" // emerald-400
                                  : x.attendancePercentage >= 50
                                    ? "#fbbf24" // amber-400
                                    : "#f87171", // red-400
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

export default Students;
