export interface Period {
  periodNumber: number;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
}

export interface DaySchedule {
  day: string;
  periods: Period[];
}