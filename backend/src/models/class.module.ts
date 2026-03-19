import mongoose, { Schema, Document, Model } from "mongoose";

type DayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface Period {
  periodNumber: number;
  subject: string;
  teacher?: mongoose.Types.ObjectId;
  startTime: string;
  endTime: string;
}

export interface Day {
  day: DayName;
  periods: Period[];
}

export interface Timetable {
  day: DayName;
  periods: Period[];
}

export interface IClass extends Document {
  classNo: number;
  academicYear: string;
  section: string;
  status: "active" | "passedOut";
  classTeacher: mongoose.Types.ObjectId;
  countOfBoys: number;
  countOfGirls: number;
  timetable: Day[];
  totalStudents: number;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

const periodSchema = new Schema<Period>(
  {
    periodNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },

    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
      validate: {
        validator: function (value: string) {
          return timeToMinutes((this as any).startTime) < timeToMinutes(value);
        },
        message: "endTime must be greater than startTime",
      },
    },
  },
  { _id: false },
);

const dayTimetableSchema = new Schema<Day>(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      required: true,
    },

    periods: {
      type: [periodSchema],

      validate: [
        {
          validator: function (periods: Period[]) {
            const nums = periods.map((p) => p.periodNumber);
            return nums.length === new Set(nums).size;
          },
          message: "Duplicate period numbers are not allowed",
        },

        {
          validator: function (periods: Period[]) {
            const sorted = periods
              .map((p) => ({
                start: p.startTime,
                end: p.endTime,
              }))
              .sort((a, b) => a.start.localeCompare(b.start));

            for (let i = 1; i < sorted.length; i++) {
              if (sorted[i].start < sorted[i - 1].end) {
                return false;
              }
            }
            return true;
          },
          message: "Periods timings overlap",
        },

        {
          validator: (periods: Period[]) => periods.length <= 10,
          message: "Max 10 periods allowed per day",
        },
      ],
    },
  },
  { _id: false },
);

const classSchema = new Schema<IClass>(
  {
    classNo: {
      type: Number,
      required: true,
    },

    academicYear: {
      type: String,
      required: true,
      index: true,
    },

    section: {
      type: String,
      required: true,
      default: "A",
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      default: "active",
      enum: ["active", "passedOut"],
    },

    classTeacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    countOfBoys: {
      type: Number,
      required: true,
      min: 0,
    },

    countOfGirls: {
      type: Number,
      required: true,
      min: 0,
    },

    timetable: {
      type: [dayTimetableSchema],
      default: [],
      validate: {
        validator: function (days: Day[]) {
          const names = days.map((d) => d.day);
          return names.length === new Set(names).size;
        },
        message: "Duplicate days are not allowed in timetable",
      },
    },
  },
  { timestamps: true },
);

classSchema.virtual("totalStudents").get(function (this: IClass) {
  return this.countOfBoys + this.countOfGirls;
});

classSchema.index(
  { classNo: 1, section: 1, academicYear: 1 },
  { unique: true },
);

classSchema.index({ classTeacher: 1 });
classSchema.index({ "timetable.day": 1 });

const Class: Model<IClass> =
  mongoose.models.Class ||
  mongoose.model<IClass>("Class", classSchema, "classes");

export default Class;
