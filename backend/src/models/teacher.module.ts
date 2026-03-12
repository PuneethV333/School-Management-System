import mongoose,{Schema,Document} from "mongoose";

export interface teacher extends Document{
  name:string
  gender:"Male" | "Female" | "Other"
  dob:Date
  email:string
  phone:string
  address:string
  authId:string
  role:"teacher" | "admin"
  subjects:string[]
  experience:number
  qualification:string
  profilePicUrl:string
  isActive:boolean
}


const teacherSchema = new Schema<teacher>(
  {
    
    name: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    dob: {
      type: Date,
      required: true,
      validate: {
        validator: function (value:Date) {
          const today = new Date();
          let age = today.getFullYear() - value.getFullYear();
          const m = today.getMonth() - value.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < value.getDate())) {
            age--;
          }
          return age >= 18;
        },
        message: "Teacher must be at least 18 years old",
      },
    },

    
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
      validate: {
        validator: function (value:string) {
          if (!value) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format",
      },
    },

    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },

    address: {
      type: String,
      trim: true,
    },

    
    authId: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["teacher", "admin"],
      default: "teacher",
    },

    
    subjects: [
      {
        type: String, 
        trim: true,
      },
    ],

    experience: {
      type: Number,
      min: 0,
      default: 0,
    },

    qualification: {
      type: String,
      trim: true,
    },

    
    profilePicUrl: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/deymewscv/image/upload/v1760774522/hqoltmqamhhjfz7divf1.jpg",
    },

    
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {timestamps: true}
);

export default mongoose.model("Teacher", teacherSchema,"teachers"); 