import type { ReturnType } from "./resolveClassAttendance";

export interface returnType {
  monthNumber: number;
  weeks: ReturnType[];
}

export const returnMonthsData = (
  props: Array<returnType>,
): returnType | undefined => {
  const monthNumber = new Date().getMonth() + 1;
  return props.find((m) => m.monthNumber === monthNumber);
};
