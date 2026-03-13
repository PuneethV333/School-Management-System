import mongoose,{Schema,Document, Model} from "mongoose";

export interface authority extends Document{
    name:string;
    gender:"Male"|"Female"|"Other";
    dob:Date;
    email:string;
    phone:string;
    address:string;
    authId:string;
    role:string;
    roleTitle:string;
    isActive:boolean;
    profilePicUrl:string
    
}


const authoritySchema = new Schema<authority>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    dob: {
      type: Date,
      validate: {
        validator: function (value:Date) {
          if (!value) return true; 
          const today = new Date();
          let age = today.getFullYear() - value.getFullYear();
          const m = today.getMonth() - value.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < value.getDate())) {
            age--;
          }
          return age >= 18;
        },
        message: "Authority must be at least 18 years old",
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
      enum: ["authority", "admin", "principal", "developer"], 
      default: "authority",
    },

    roleTitle: {
      type: String, 
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    profilePicUrl: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/deymewscv/image/upload/v1760774522/hqoltmqamhhjfz7divf1.jpg",
    },
  },
  { timestamps: true }
);

const Authority: Model<authority> = mongoose.models.Authority || mongoose.model<authority>("Authority", authoritySchema);

export default Authority
