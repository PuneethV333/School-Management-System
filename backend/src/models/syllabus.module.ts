import mongoose, { Schema, Document, Model } from "mongoose";

export interface lesson {
  unitNo: number;
  unitName: string;
  details: string;
}

const lessonSchema = new Schema<lesson>(
  {
    unitNo: {
      type: Number,
      required: true,
    },
    unitName: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

export interface detail {
  subject: "Math" | "Social" | "Science" | "Hindi" | "Kannada" | "English";
  title: string;
  lessons: lesson[];
}

const detailsSchema = new Schema<detail>(
  {
    subject: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    lessons: [lessonSchema],
  },
  { _id: false },
);

export interface syllabus extends Document {
  classNo: number;
  syllabus: detail[];
}

const syllabusSchema = new Schema<syllabus>(
  {
    classNo: {
      type: Number,
      required: true,
    },
    syllabus: [detailsSchema],
  },
  { timestamps: true },
);

syllabusSchema.index({ classNo: 1 });
syllabusSchema.index({ "syllabus.subject": 1 });

const Syllabus: Model<syllabus> =
  mongoose.models.Syllabus ||
  mongoose.model("Syllabus", syllabusSchema, "syllabuses");

export default Syllabus;
