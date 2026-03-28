import type { ReturnType } from "../utils/resolveClassAttendance";

type Props = {
  data: ReturnType | null;
};

const DisplayWeeklyAttendance = ({ data }: Props) => {
  if (!data) return null;
  
  console.log(data);
  

  return (
    <div>
      <h1 className="text-right">{data.weekNumber}</h1>
    </div>
  );
};

export default DisplayWeeklyAttendance;