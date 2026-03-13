import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuth extends Document {
  authId: string;
  password: string;
  role: "teacher" | "student" | "authority";
}

const authSchema = new Schema<IAuth>(
  {
    authId: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, default: "vbhs123" },
    role: {
      type: String,
      enum: ["student", "teacher", "authority"],
      required: true,
    },
  },
  { timestamps: true }
);

const Auth: Model<IAuth> =
  mongoose.models.Auth || mongoose.model<IAuth>("Auth", authSchema);

export default Auth;