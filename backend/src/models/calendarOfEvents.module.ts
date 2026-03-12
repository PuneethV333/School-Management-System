import mongoose, { Schema, Document } from "mongoose";

export interface day {
    date: Date;
    type: "WORKING_DAY" | "HOLIDAY" | "EVENT" | "EXAM";
    title?: string;
    description?: string
    appliesTo: "ALL" | "STUDENTS" | "TEACHERS"
}

export interface CalendarOfEvent extends Document {
    academicYear: string;
    calendar: day[];
}

const calendarDaySchema = new Schema<day>(
    {
        date: {
            type: Date,
            required: true,
        },
        type: {
            type: String,
            enum: ["WORKING_DAY", "HOLIDAY", "EVENT", "EXAM"],
            required: true,
        },
        title: String,
        description: String,
        appliesTo: {
            type: String,
            enum: ["ALL", "STUDENTS", "TEACHERS"],
            default: "ALL",
        },
    },
    { _id: false }
);

const CalendarOfEventsSchema = new Schema<CalendarOfEvent>(
    {
        academicYear: {
            type: String,
            required: true,
            unique: true,
        },
        calendar: {
            type: [calendarDaySchema],
            default: [],
        },
    },
    { timestamps: true }
);

export default mongoose.model<CalendarOfEvent>(
    "CalendarOfEvents",
    CalendarOfEventsSchema
);
