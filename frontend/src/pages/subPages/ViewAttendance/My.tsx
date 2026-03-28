/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import { useFetchMyAttendance } from "../../../hooks/useAttendanceData";
import { useFetchMe } from "../../../hooks/useAuth";
import { resolveMyAttendance } from "../../../utils/resolveMyAttendance";
import type { returnType } from "../../../utils/returnMonthsData";
import DisplayWeeklyAttendance from "../../../components/DisplayWeeklyAttendance";
import type { ReturnType } from "../../../utils/resolveClassAttendance";
import DisplayMonthlyAttendance from "../../../components/DisplayMonthlyAttendance";

const My = () => {
  const { data: userData, isPending: loading } = useFetchMe();
  const { data: myAttendanceData, isPending: loadingAttendance } =
    useFetchMyAttendance(userData);
  const [dataType, setDataType] = useState<"weekly" | "monthly">("monthly");
  const [data, setData] = useState<returnType | ReturnType | null>(null);

  useEffect(() => {
    if (!myAttendanceData?.months) return;
    const sorted = [...myAttendanceData.months].sort(
      (a: returnType, b: returnType) => a.monthNumber - b.monthNumber
    );
    const res = resolveMyAttendance(dataType, sorted);
    setData(res);
  }, [dataType, myAttendanceData?.months]);

  if (loading || loadingAttendance) return <Spinner />;

  return (
    <div className="min-h-screen py-8 px-2">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-black bg-linear-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            My Attendance
          </h1>
          <p className="text-sm text-white/30 mt-1">
            {dataType === "weekly" ? "This week's breakdown" : "This month's breakdown"}
          </p>
        </div>

        <div className="mb-6 p-1 bg-white/5 border border-white/10 rounded-2xl flex gap-1 w-fit">
          {(["monthly", "weekly"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setDataType(type)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 capitalize
                ${dataType === type
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                  : "text-white/40 hover:text-white/70"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {dataType === "weekly" ? (
          <DisplayWeeklyAttendance data={data as ReturnType | null} />
        ) : (
          <DisplayMonthlyAttendance data={data as returnType | null} />
        )}
      </div>
    </div>
  );
};

export default My;