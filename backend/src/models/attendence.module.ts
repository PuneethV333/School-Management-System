import mongoose, { Schema, Document, Model } from "mongoose";
import CalendarOfEvents from "./calendarOfEvents.module";

interface Day {
    date: Date;
    presentCount: number | null;
    isHoliday: boolean;
    isSunday: boolean;
    hasClass: boolean;
}

interface Week {
    weekNumber: number;
    days: Day[];
}

interface Month {
    monthNumber: number;
    weeks: Week[];
}

export interface IClassAttendance extends Document {
    class: mongoose.Types.ObjectId;
    academicYear: string;
    totalStudents: number;
    months: Month[];
}

interface InitializeInput {
    academicYear: string;
    startDate: Date;
    endDate: Date;
}

interface ClassAttendanceModel extends Model<IClassAttendance> {
    initializeAttendance(input: InitializeInput): Promise<Month[]>;
}

const daySchema = new Schema<Day>(
    {
        date: { type: Date, required: true },
        presentCount: { type: Number, default: null, min: 0 },
        isHoliday: { type: Boolean, default: false },
        isSunday: { type: Boolean, default: false },
        hasClass: { type: Boolean, default: true },
    },
    { _id: false }
);

const weekSchema = new Schema<Week>(
    {
        weekNumber: { type: Number, required: true, min: 1 },
        days: { type: [daySchema], default: [] },
    },
    { _id: false }
);

const monthSchema = new Schema<Month>(
    {
        monthNumber: { type: Number, required: true, min: 1, max: 12 },
        weeks: { type: [weekSchema], default: [] },
    },
    { _id: false }
);

const classAttendanceSchema = new Schema<IClassAttendance>(
    {
        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },

        academicYear: {
            type: String,
            required: true,
        },

        totalStudents: {
            type: Number,
            required: true,
            min: 0,
        },

        months: {
            type: [monthSchema],
            default: [],
        },
    },
    { timestamps: true }
);

classAttendanceSchema.statics.initializeAttendance = async function ({
    academicYear,
    startDate,
    endDate,
}: InitializeInput) {
    const calendarDoc = await CalendarOfEvents.findOne({ academicYear });

    if (!calendarDoc) {
        console.warn(
            `Calendar for academic year ${academicYear} not found`
        );
    }

    const classDays = [1, 2, 3, 4, 5, 6];
    const monthsMap = new Map<number, any>();

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

        const month = monthsMap.get(monthNumber);

        if (month.lastIsoWeek !== isoWeek) {
            month.weeks.push({
                weekNumber: month.weeks.length + 1,
                days: [],
            });

            month.lastIsoWeek = isoWeek;
        }

        month.weeks.at(-1).days.push({
            date: current,
            presentCount: null,
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

function normalizeDate(date: Date) {
    return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
}

function getISOWeek(date: Date) {
    const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );

    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);

    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

const ClassAttendance = (mongoose.models.ClassAttendance as Model<IClassAttendance, ClassAttendanceModel>) ||
    mongoose.model<IClassAttendance, ClassAttendanceModel>(
        "ClassAttendance",
        classAttendanceSchema
    );


export default ClassAttendance