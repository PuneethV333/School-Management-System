import mongoose, { Schema, Document, Model } from "mongoose";

export interface Assessment {
    type: "SA-1" | "SA-2" | "FA-1" | "FA-2" | "FA-3" | "FA-4";
    marksObtained: number;
    maxMarks: number;
    examDate: Date;
}

const assessmentSchema = new Schema<Assessment>(
    {
        type: {
            type: String,
            enum: ["SA-1", "SA-2", "FA-1", "FA-2", "FA-3", "FA-4"],
            required: true,
        },

        marksObtained: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: function (v: number) {
                    return v <= (this as any).maxMarks;
                },
                message: "Marks obtained cannot exceed max marks",
            },
        },

        maxMarks: {
            type: Number,
            required: true,
            min: 1,
        },

        examDate: {
            type: Date,
            required: true,
        },
    },
    { _id: false }
);

export interface Subject {
    subject: string;
    assessments: Assessment[];
}

const subjectSchema = new Schema<Subject>(
    {
        subject: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },

        assessments: {
            type: [assessmentSchema],
            default: [],
        },
    },
    { _id: false }
);

export interface IExamTest extends Document {
    studentId: mongoose.Types.ObjectId;
    classNo: number;
    section: string;
    academicYear: string;
    subjects: Subject[];
    publishedAt?: Date | null;
}

const examTestSchema = new Schema<IExamTest>(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        classNo: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
        },

        section: {
            type: String,
            default: "A",
        },

        academicYear: {
            type: String,
            required: true,
        },

        subjects: {
            type: [subjectSchema],

            validate: {
                validator: function (subjects: Subject[]) {
                    const names = subjects.map((s) => s.subject);
                    return names.length === new Set(names).size;
                },
                message: "Duplicate subjects are not allowed",
            },
        },

        publishedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const ExamTest : Model<IExamTest> = mongoose.models.ExamTest ||mongoose.model<IExamTest>(
    "ExamTest",
    examTestSchema
);

export default ExamTest