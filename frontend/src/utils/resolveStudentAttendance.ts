import { type returnType } from "./returnMonthsData";

export interface student {
  name: string;
  authId: string;
}

export interface studentAttendenceProps {
  class: number;
  months: returnType[];
  student: student;
}

export interface resolvedStudentsAttendance {
  name: string;
  attendancePercentage: number;
  isPresentToday: boolean;
}

export const resolveStudentAttendance = (
  data: studentAttendenceProps[],
): resolvedStudentsAttendance[] => {
  const res: resolvedStudentsAttendance[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  data?.forEach((x) => {
    let totalClassDays = 0;
    let presentDays = 0;
    let isPresentToday = false;

    x?.months?.forEach((month) => {
      month?.weeks?.forEach((week) => {
        week?.days?.forEach((day) => {
          if (!day.hasClass) return;

          const dayDate = new Date(day.date);
          dayDate.setHours(0, 0, 0, 0);

          if (dayDate > today) return;

          totalClassDays++;

          if (day.status === "PRESENT") {
            presentDays++;
          }

          if (dayDate.getTime() === today.getTime()) {
            isPresentToday = day.status === "PRESENT";
          }
        });
      });
    });

    const attendancePercentage =
      totalClassDays > 0
        ? parseFloat(((presentDays / totalClassDays) * 100).toFixed(2))
        : 0;

    const temp: resolvedStudentsAttendance = {
      name: x?.student?.name,
      attendancePercentage,
      isPresentToday,
    };

    res.push(temp);
  });

  return res;
};
