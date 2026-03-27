/* eslint-disable @typescript-eslint/no-explicit-any */
export const sortAttendanceData = (data: any) => {
  if (!data) return data;

  const order = (m: number) => (m >= 4 ? m : m + 12);

  const sortedMonths = [...data.months]
    .sort((a: any, b: any) => order(a.monthNumber) - order(b.monthNumber))
    .map((month: any) => ({
      ...month,
      weeks: [...month.weeks]
        .sort((a: any, b: any) => a.weekNumber - b.weekNumber)
        .map((week: any) => ({
          ...week,
          days: [...week.days].sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          ),
        })),
    }));

  return {
    ...data,
    months: sortedMonths,
  };
};