export type Day = {
  date: string;
  presentCount: number | null;
  isHoliday: boolean;
  isSunday: boolean;
  hasClass: boolean;
};

export interface ReturnType {
  weekNumber: number;
  days: Day[];
}

const ATTENDANCE_FINALIZED_HOUR = 10;

export const resolveClassAttendance = (
  data: ReturnType[],
): ReturnType | null => {
  const now = new Date();

  const target = new Date(now);
  if (now.getHours() < ATTENDANCE_FINALIZED_HOUR) {
    target.setDate(target.getDate() - 1);
  }
  target.setHours(0, 0, 0, 0);

  const targetTime = target.getTime();

  for (const week of data) {
    for (const day of week.days) {
      const d = new Date(day.date);
      d.setHours(0, 0, 0, 0);

      if (d.getTime() === targetTime) {
        return {
          weekNumber: week.weekNumber,
          days: [day],
        };
      }
    }
  }

  return null;
};
