import mongoose, { Model, Schema } from "mongoose";

export interface IDay {
    date: Date;
    attendanceCount?: number;
}

const daySchema = new Schema<IDay>(
    {
        date: {
            type: Date,
            required: true,
        },

        attendanceCount: {
            type: Number,
            min: 0,
            default: undefined,
        },
    },
    { _id: false }
);



export interface IWeek {
    weekNumber: number;
    days: IDay[];
    totalAttendance?: number;
}

const weekSchema = new Schema<IWeek>(
    {
        weekNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 53,
        },

        days: {
            type: [daySchema],
            default: [],
        },

        totalAttendance: {
            type: Number,
            min: 0,
            default: undefined,
        },
    },
    { _id: false }
);



export interface IMonth {
    monthNumber: number;
    weeks: IWeek[];
    totalAttendance?: number;
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

        totalAttendance: {
            type: Number,
            min: 0,
            default: undefined,
        },
    },
    { _id: false }
);



export interface IYear {
    yearNumber: number;
    months: IMonth[];
    totalAttendance?: number;
}

const yearSchema = new Schema<IYear>(
    {
        yearNumber: {
            type: Number,
            required: true,
        },

        months: {
            type: [monthSchema],
            default: [],
        },

        totalAttendance: {
            type: Number,
            min: 0,
            default: undefined,
        },
    },
    { _id: false }
);



export interface ISchool {
    schoolName: string;
    academicYear?: string;
    address?: string;
    principalName?: string;

    shift: "Morning" | "Evening";

    totNoOfStudents: number;
    totNoOfBoys: number;
    totNoOfGirls: number;
    totNoOfOthers: number;
    totNoOfTeachers: number;

    attendanceYears: IYear[];

    totalStudents?: number;
}

const schoolSchema = new Schema<ISchool>(
    {
        schoolName: {
            type: String,
            required: true,
            trim: true,
        },

        academicYear: {
            type: String,
            trim: true,
        },

        address: {
            type: String,
            trim: true,
        },

        principalName: {
            type: String,
            trim: true,
        },

        shift: {
            type: String,
            enum: ["Morning", "Evening"],
            default: "Morning",
        },

        totNoOfStudents: {
            type: Number,
            required: true,
            min: 0,
        },

        totNoOfBoys: {
            type: Number,
            required: true,
            min: 0,
        },

        totNoOfGirls: {
            type: Number,
            required: true,
            min: 0,
        },

        totNoOfOthers: {
            type: Number,
            required: true,
            min: 0,
        },

        totNoOfTeachers: {
            type: Number,
            required: true,
            min: 0,
        },

        attendanceYears: {
            type: [yearSchema],
            default: [],
        },
    },
    { timestamps: true }
);



schoolSchema.virtual("totalStudents").get(function () {
    return (
        this.totNoOfBoys +
        this.totNoOfGirls +
        this.totNoOfOthers
    );
});



function getWeekNumber(date: Date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);

    const dayDiff =
        Math.floor(
            (date.getTime() - startOfYear.getTime()) /
            (24 * 60 * 60 * 1000)
        ) +
        startOfYear.getDay() +
        1;

    return Math.ceil(dayDiff / 7);
}



const School : Model<ISchool> = mongoose.models.School || mongoose.model<ISchool>(
    "School",
    schoolSchema
);

export default School