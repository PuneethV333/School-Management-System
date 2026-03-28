import type { ReturnType } from "./resolveClassAttendance";
import type { returnType } from "./returnMonthsData";

export const resolveMyAttendance = (
  type: "weekly" | "monthly",
  data: returnType[],
): returnType | ReturnType | null => {
    
  let res: returnType | ReturnType | null = null;
  switch (type) {
    case "weekly":
      res = weekly(data);
      return res;

    case "monthly":
      res = monthly(data);
      return res;

    default:
      return res;
  }
};

const monthly = (data: returnType[]): returnType => {
  const monthNo = new Date().getMonth() - 1;
  return data[monthNo];
};

const weekly = (data: returnType[]): ReturnType => {
  const monthlyData = monthly(data);
  const weekNo = Math.ceil(new Date().getDate() / 7);
  return monthlyData.weeks[weekNo];
};
