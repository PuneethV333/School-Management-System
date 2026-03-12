import mongoose, { Schema, Document } from "mongoose";

interface Attachment {
  fileName: string;
  fileUrl: string;
}

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  category: "General" | "Exam" | "Holiday" | "Event" | "Fee" | "Emergency";
  classes: number[];
  attachments: Attachment[];
  academicYear: string;
  publishAt: Date;
  expireAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema: Schema<IAnnouncement> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["General", "Exam", "Holiday", "Event", "Fee", "Emergency"],
      default: "General",
    },

    classes: {
      type: [Number],
      default: [],
    },

    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],

    academicYear: {
      type: String,
      required: true,
    },

    publishAt: {
      type: Date,
      default: Date.now,
    },

    expireAt: {
      type: Date,
      validate: {
        validator: function (this: IAnnouncement, v: Date) {
          return !v || v > this.publishAt;
        },
        message: "Expire date must be after publish date",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

announcementSchema.index({
  publishAt: 1,
  expireAt: 1,
  isActive: 1,
  academicYear: 1,
});

export default mongoose.model<IAnnouncement>(
  "Announcement",
  announcementSchema
);