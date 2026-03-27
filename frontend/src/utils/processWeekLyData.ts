import type { dashboardGraphInputProps } from "../types/attendanceGraph.types";
import {  type returnType } from "./returnMonthsData";


export const processWeeklyData = (
  thisMonthsClassAttendance: returnType,
  today: Date,
  totalStudents: number
): dashboardGraphInputProps => {

  const weekNo = getWeekOfMonth(today);


  const weekData = thisMonthsClassAttendance?.weeks[weekNo - 1]?.days || [];

  let presCount = 0;
  let validDays = 0;

  for (const day of weekData) {
    if (day.isSunday) continue;

    validDays++;

    if (day.presentCount !== null) {
      presCount += Number(day.presentCount);
    }
  }

  const percentage =
    totalStudents && validDays
      ? Number(
          ((presCount / (totalStudents * validDays)) * 100).toFixed(2)
        )
      : 0;

  return {
    date: today,
    day: getDayName(today),
    total: totalStudents,
    presentPercentage: percentage,
  };
};

const getWeekOfMonth = (date: Date): number => {
  return Math.ceil(date.getDate() / 7);
};

const getDayName = (date: Date): dashboardGraphInputProps["day"] => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday", 
  ];

  return days[date.getDay()] as dashboardGraphInputProps["day"];
};