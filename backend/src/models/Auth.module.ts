import mongoose,{Schema,Document} from "mongoose";



export interface IAuth extends Document{
    authId:string;
    password:string;
    role:"teacher"|"student"|"authority"
}

const authSchema = new Schema<IAuth>({
  authId: { type: String, required: true, unique: true ,trim:true},
  password: { type: String, required: true ,default:"vbhs123"},
  role: { type: String, enum: ["student", "teacher", "authority"], required: true },
}, { timestamps: true });

export default mongoose.model<IAuth>("Auth", authSchema,"auths");


