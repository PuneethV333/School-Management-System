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
        },
    },
    { _id: false }
);

export interface Day {
    day: DayName;
    periods: Period[];
}

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

            validate: {
                validator: function (periods: Period[]) {
                    const numbers = periods.map((p) => p.periodNumber);
                    return numbers.length === new Set(numbers).size;
                },
                message: "Duplicate period numbers are not allowed for the same day",
            },
        },
    },
    { _id: false }
);

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
        },
    },
    { timestamps: true }
);

classSchema.virtual("totalStudents").get(function (this: IClass) {
    return this.countOfBoys + this.countOfGirls;
});

classSchema.index({ classNo: 1, section: 1, academicYear: 1 }, { unique: true });
classSchema.index({ classTeacher: 1 });

const Class : Model<IClass> = mongoose.models.Class || mongoose.model<IClass>("Class", classSchema, "classes");