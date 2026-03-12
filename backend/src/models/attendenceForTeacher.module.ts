import mongoose, { Schema, Document, Model } from "mongoose";
import CalendarOfEvents from "./calendarOfEvents.module.js";



type AttendanceStatus = "PRESENT" | "ABSENT" | "HOLIDAY" | "LEAVE" | null;

interface IDay {
    date: Date;
    status: AttendanceStatus;
    isHoliday: boolean;
    isSunday: boolean;
    hasClass: boolean;
}

interface IWeek {
    weekNumber: number;
    days: IDay[];
}

interface IMonth {
    monthNumber: number;
    weeks: IWeek[];
}

export interface ITeacherAttendance extends Document {
    teacher: mongoose.Types.ObjectId;
    academicYear: string;
    months: IMonth[];
}



interface InitializeAttendanceInput {
    academicYear: string;
    startDate: Date;
    endDate: Date;
}

interface TeacherAttendanceModel extends Model<ITeacherAttendance> {
    initializeAttendance(
        data: InitializeAttendanceInput
    ): Promise<IMonth[]>;
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



const teacherAttendanceSchema = new Schema<
    ITeacherAttendance,
    TeacherAttendanceModel
>(
    {
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },

        academicYear: {
            type: String,
            required: true,
        },

        months: {
            type: [monthSchema],
            default: [],
        },
    },
    { timestamps: true }
);



teacherAttendanceSchema.statics.initializeAttendance =
    async function ({
        academicYear,
        startDate,
        endDate,
    }: InitializeAttendanceInput): Promise<IMonth[]> {

        const calendarDoc = await CalendarOfEvents.findOne({
            academicYear,
        });

        if (!calendarDoc) {
            console.warn(
                `Calendar for academic year ${academicYear} not found`
            );
        }

        const classDays = [1, 2, 3, 4, 5, 6];

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

    const yearStart = new Date(
        Date.UTC(d.getUTCFullYear(), 0, 1)
    );

    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}



const TeacherAttendance = mongoose.model<
    ITeacherAttendance,
    TeacherAttendanceModel
>(
    "TeacherAttendance",
    teacherAttendanceSchema,
    "teacherattendances"
);

export default TeacherAttendance;