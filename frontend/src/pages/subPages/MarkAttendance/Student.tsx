/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Spinner from "../../../components/Spinner";
import { useFetchMe } from "../../../hooks/useAuth";
import { useMarkStudentsAttendance } from "../../../hooks/useMarkAttendance";
import { useFetchStudentsByClass } from "../../../hooks/useStudentData";
import type { markStudentAttendanceProps } from "../../../types/markStudentAttendance";
import SelectClass from "../../../components/SelectClass";
import { UserCheck, UserX, Clock, CheckSquare } from "lucide-react";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LEAVE";

interface AttendanceRecord {
  authId: string;
  status: AttendanceStatus;
}

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  PRESENT: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  ABSENT: "bg-red-500/20 text-red-400 border-red-500/40",
  LEAVE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
};

const Student = () => {
  const { data: userData, isPending: loading } = useFetchMe();
  const [classNo, setClassNo] = useState<number>(1);
  const { data: students, isLoading: loadingStudentsData } =
    useFetchStudentsByClass(userData, classNo);
  const { mutate: markAttendance, isPending: markingAttendance } =
    useMarkStudentsAttendance();

  const [attendance, setAttendance] = useState<
    Record<string, AttendanceRecord>
  >({});

//   const students = studentByClass;

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceRecord> = {};
    for (const s of students) {
      updated[s.authId] = { authId: s.authId, status };
    }
    setAttendance(updated);
  };

  const handleToggle = (authId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [authId]: { authId, status },
    }));
  };

  const handleSubmit = () => {
    const selectedStudents = Object.values(attendance);
    if (selectedStudents.length === 0) return;

    const payload: markStudentAttendanceProps = {
      classNo,
      selectedStudents,
    };

    markAttendance(payload);
  };

  const presentCount = Object.values(attendance).filter(
    (a) => a.status === "PRESENT",
  ).length;
  const absentCount = Object.values(attendance).filter(
    (a) => a.status === "ABSENT",
  ).length;
  const leaveCount = Object.values(attendance).filter(
    (a) => a.status === "LEAVE",
  ).length;
  const unmarkedCount = students?.length - Object.keys(attendance).length;

  if (loading || loadingStudentsData) return <Spinner />;

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-6 sm:py-8 lg:py-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Attendance
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Mark today's attendance for your class
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-4 shadow-lg shadow-black/30 flex items-center gap-3">
            <SelectClass
              classNo={classNo}
              setClassNo={(val) => {
                setClassNo(val);
                setAttendance({});
              }}
            />
          </div>

          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-lg shadow-black/30 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <UserCheck className="text-emerald-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Present</p>
              <p className="text-emerald-400 text-2xl font-bold">
                {presentCount}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-4 shadow-lg shadow-black/30 flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-xl">
              <UserX className="text-red-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Absent</p>
              <p className="text-red-400 text-2xl font-bold">{absentCount}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-yellow-500/30 rounded-2xl p-4 shadow-lg shadow-black/30 flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-xl">
              <Clock className="text-yellow-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Leave</p>
              <p className="text-yellow-400 text-2xl font-bold">{leaveCount}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-4 shadow-lg shadow-black/30 flex items-center gap-3">
            <div className="p-2 bg-slate-700/40 rounded-xl">
              <CheckSquare className="text-slate-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Unmarked</p>
              <p className="text-slate-300 text-2xl font-bold">
                {unmarkedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => handleMarkAll("PRESENT")}
            className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-medium transition-all"
          >
            ✓ Mark All Present
          </button>
          <button
            onClick={() => handleMarkAll("ABSENT")}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium transition-all"
          >
            ✗ Mark All Absent
          </button>
          <button
            onClick={() => setAttendance({})}
            className="px-4 py-2 bg-slate-700/30 hover:bg-slate-700/50 text-slate-400 border border-slate-700/60 rounded-xl text-sm font-medium transition-all"
          >
            ↺ Reset
          </button>
        </div>

        {students.length === 0 ? (
          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg">
              No students found for class {classNo}
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl shadow-lg shadow-black/30 overflow-hidden mb-6">
            <div className="grid grid-cols-12 px-5 py-3 border-b border-slate-700/60 bg-slate-800/40">
              <p className="col-span-1 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                #
              </p>
              <p className="col-span-5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Student
              </p>
              <p className="col-span-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Roll No
              </p>
              <p className="col-span-4 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Status
              </p>
            </div>

            {students.map((student: any, index: number) => {
              const record = attendance[student.authId];
              const status = record?.status ?? null;

              return (
                <div
                  key={student._id}
                  className={`grid grid-cols-12 items-center px-5 py-4 border-b border-slate-700/30 last:border-0 transition-colors ${
                    status === "PRESENT"
                      ? "bg-emerald-500/5"
                      : status === "ABSENT"
                        ? "bg-red-500/5"
                        : status === "LEAVE"
                          ? "bg-yellow-500/5"
                          : "hover:bg-slate-800/30"
                  }`}
                >
                  <p className="col-span-1 text-slate-500 text-sm">
                    {index + 1}
                  </p>

                  <div className="col-span-5 flex items-center gap-3">
                    {student.profilePicUrl ? (
                      <img
                        src={student.profilePicUrl}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-sm font-bold">
                        {student.name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-slate-200 text-sm font-medium">
                        {student.name}
                      </p>
                      <p className="text-slate-500 text-xs">{student.authId}</p>
                    </div>
                  </div>

                  <p className="col-span-2 text-slate-400 text-sm">
                    {student.rollNo}
                  </p>

                  <div className="col-span-4 flex gap-2">
                    {(["PRESENT", "ABSENT", "LEAVE"] as AttendanceStatus[]).map(
                      (s) => (
                        <button
                          key={s}
                          onClick={() => handleToggle(student.authId, s)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                            status === s
                              ? STATUS_STYLES[s]
                              : "bg-slate-800 text-slate-500 border-slate-700/60 hover:border-slate-500"
                          }`}
                        >
                          {s[0]}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={markingAttendance || Object.keys(attendance).length === 0}
            className="px-8 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            {markingAttendance
              ? "Saving..."
              : `Submit Attendance (${Object.keys(attendance).length}/${students.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Student;
