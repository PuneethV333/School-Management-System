import mongoose,{Schema,Document} from "mongoose";


export interface Assessment {
    type: string;
    name:string;
    marksObtained: number;
    maxMarks: number;
    examDate: Date;
}


const assessmentSchema = new Schema<Assessment>(
  {
    type: {
      type: String,
      default:"UT",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (v:number) {
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
    assessments: [assessmentSchema],
  },
  { _id: false }
);

export interface IMarksSchema extends Document{
    studentId:mongoose.Schema.Types.ObjectId
    class:number
    section:string
    academicYear:string
    subjects:Subject[]
    publishedAt:Date
}


const marksSchema = new Schema<IMarksSchema>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    class: {
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
        validator: function (subjects:Subject[]) {
          const names = subjects.map((s:Subject) => s.subject);
          return names.length === new Set(names).size;
        },
        message: "Duplicate subjects are not allowed",
      },
    },
    publishedAt: Date,
  },
  { timestamps: true }
);

marksSchema.index(
  { studentId: 1, class: 1, academicYear: 1 },
  { unique: true }
);
marksSchema.index({ class: 1, academicYear: 1 });

export default mongoose.model<IMarksSchema>("Marks", marksSchema,"marks");
