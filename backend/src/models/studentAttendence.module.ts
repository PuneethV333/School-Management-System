import mongoose, { Schema, Document, Model } from "mongoose";
import CalendarOfEvents from "./calendarOfEvents.module";

export interface IDay {
  date: Date;
  status: "PRESENT" | "ABSENT" | "HOLIDAY" | "LEAVE" | null;
  isHoliday: boolean;
  isSunday: boolean;
  hasClass: boolean;
}

const daySchema = new Schema<IDay>(
  {
    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "HOLIDAY", "LEAVE"],
      default: null,
    },

    isHoliday: {
      type: Boolean,
      default: false,
    },

    isSunday: {
      type: Boolean,
      default: false,
    },

    hasClass: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);



export interface IWeek {
  weekNumber: number;
  days: IDay[];
}

const weekSchema = new Schema<IWeek>(
  {
    weekNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    days: {
      type: [daySchema],
      default: [],
    },
  },
  { _id: false }
);



export interface IMonth {
  monthNumber: number;
  weeks: IWeek[];
}

const monthSchema = new Schema<IMonth>(
  {
    monthNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    weeks: {
      type: [weekSchema],
      default: [],
    },
  },
  { _id: false }
);



export interface IStudentAttendance extends Document {
  student: mongoose.Types.ObjectId;
  academicYear: string;
  class: number;
  months: IMonth[];
}



export interface AttendanceInit {
  academicYear: string;
  startDate: Date;
  endDate: Date;
}

interface StudentAttendanceModel extends Model<IStudentAttendance> {
  initializeAttendance(data: AttendanceInit): Promise<IMonth[]>;
}



const studentAttendanceSchema = new Schema<IStudentAttendance>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    academicYear: {
      type: String,
      required: true,
    },

    class: {
      type: Number,
      required: true,
    },

    months: {
      type: [monthSchema],
      default: [],
    },
  },
  { timestamps: true }
);



studentAttendanceSchema.statics.initializeAttendance = async function ({
  academicYear,
  startDate,
  endDate,
}: AttendanceInit): Promise<IMonth[]> {
  const calendarDoc = await CalendarOfEvents.findOne({ academicYear });

  if (!calendarDoc) {
    console.warn(
      `Calendar for academic year ${academicYear} not found`
    );
  }

  const classDays = [1, 2, 3, 4, 5, 6]; // Mon–Sat

  const monthsMap = new Map<
    number,
    { monthNumber: number; weeks: IWeek[]; lastIsoWeek: number | null }
  >();

  let current = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  while (current <= end) {
    const dayOfWeek = current.getUTCDay();

    const isSunday = dayOfWeek === 0;
    const hasClass = classDays.includes(dayOfWeek);
    const isHoliday = isSunday || !hasClass;

    const monthNumber = current.getUTCMonth() + 1;
    const isoWeek = getISOWeek(current);

    if (!monthsMap.has(monthNumber)) {
      monthsMap.set(monthNumber, {
        monthNumber,
        weeks: [],
        lastIsoWeek: null,
      });
    }

    const month = monthsMap.get(monthNumber)!;

    if (month.lastIsoWeek !== isoWeek) {
      month.weeks.push({
        weekNumber: month.weeks.length + 1,
        days: [],
      });

      month.lastIsoWeek = isoWeek;
    }

    month.weeks.at(-1)!.days.push({
      date: current,
      status: isHoliday ? "HOLIDAY" : null,
      isHoliday,
      isSunday,
      hasClass,
    });

    current = new Date(current.getTime() + 86400000);
  }

  return Array.from(monthsMap.values()).map((m) => ({
    monthNumber: m.monthNumber,
    weeks: m.weeks,
  }));
};



function normalizeDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

function getISOWeek(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  const dayNum = d.getUTCDay() || 7;

  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}



const StudentAttendance : Model<IStudentAttendance> = mongoose.models.student || mongoose.model<IStudentAttendance, StudentAttendanceModel>(
  "StudentAttendance",
  studentAttendanceSchema
);

export default StudentAttendance