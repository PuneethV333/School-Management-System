/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import { useFetchMyAttendance } from "../../../hooks/useAttendanceData";
import { useFetchMe } from "../../../hooks/useAuth";
import { resolveMyAttendance } from "../../../utils/resolveMyAttendance";
import type { returnType } from "../../../utils/returnMonthsData";
import SelectType from "../../../components/SelectType";
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

  if (loading || loadingAttendance) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="mb-8">
        <SelectType dataType={dataType} setDataType={setDataType} />
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
