import { type returnType } from "./returnMonthsData";

export interface teacher {
  name: string;
  authId: string;
}

export interface teacherAttendenceProps {
  class: number;
  months: returnType[];
  student: teacher;
}

export interface resolvedTeachersAttendance {
  name: string;
  attendancePercentage: number;
  isPresentToday: boolean;
}

export const resolveTeacherAttendance = (
  data: teacherAttendenceProps[],
): resolvedTeachersAttendance[] => {
  const res: resolvedTeachersAttendance[] = [];

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

    const temp: resolvedTeachersAttendance = {
      name: x?.student?.name,
      attendancePercentage,
      isPresentToday,
    };

    res.push(temp);
  });

  return res;
};
