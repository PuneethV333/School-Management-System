import mongoose, { Schema, Document } from "mongoose";



export interface IParent {
    name?: string;
    dob?: Date;
    phone?: string;
    occupation?: string;
    email?: string;
}

const parentSchema = new Schema<IParent>({
    name: {
        type: String,
        trim: true,
    },

    dob: {
        type: Date,
    },

    occupation: {
        type: String,
        trim: true,
    },

    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function (value: string) {
                if (!value) return true;
                return /^(?:\+91)?[6-9]\d{9}$/.test(value);
            },
            message: (props: any) =>
                `${props.value} is not a valid Indian phone number`,
        },
    },

    email: {
        type: String,
        lowercase: true,
        trim: true,
        sparse: true,
        validate: {
            validator: function (value: string) {
                if (!value) return true;
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "Invalid email format",
        },
    },
});



export interface IStudent extends Document {
    name: string;
    academicYear: string;
    rollNo: number;
    class: number;
    section: "A" | "B" | "C" | "D" | "E";

    authId: string;
    email?: string;

    dob: Date;

    satsNo?: string;

    father?: IParent;
    mother?: IParent;
    guardian?: IParent;

    phone?: string;

    gender?: "Male" | "Female" | "Other";
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

    profilePicUrl?: string;

    role: string;

    admissionDate: Date;

    isActive: boolean;

    age?: number;
}



const studentSchema = new Schema<IStudent>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },

        academicYear: {
            type: String,
            required: true,
        },

        rollNo: {
            type: Number,
            required: true,
            min: 1,
            max: 999,
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
            uppercase: true,
            enum: ["A", "B", "C", "D", "E"],
        },

        authId: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            match: [
                /^vbhs[a-z0-9]+$/,
                'authId must start with "vbhs" followed by alphanumeric characters',
            ],
        },

        email: {
            type: String,
            lowercase: true,
            trim: true,
            sparse: true,
            validate: {
                validator: function (value: string) {
                    if (!value) return true;
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: "Invalid email format",
            },
        },

        dob: {
            type: Date,
            required: true,
            validate: {
                validator: function (value: Date) {
                    const today = new Date();
                    let age = today.getFullYear() - value.getFullYear();
                    const monthDiff = today.getMonth() - value.getMonth();

                    if (
                        monthDiff < 0 ||
                        (monthDiff === 0 && today.getDate() < value.getDate())
                    ) {
                        age--;
                    }

                    return age >= 5 && age <= 17;
                },
                message: "Student age must be between 5 and 17",
            },
        },

        satsNo: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            match: [/^\d{8,10}$/, "SATS number must be 8–10 digits"],
        },

        father: parentSchema,
        mother: parentSchema,
        guardian: parentSchema,

        phone: {
            type: String,
            trim: true,
            validate: {
                validator: function (value: string) {
                    if (!value) return true;
                    return /^(?:\+91)?[6-9]\d{9}$/.test(value);
                },
                message: (props: any) =>
                    `${props.value} is not a valid Indian phone number`,
            },
        },

        profilePicUrl: {
            type: String,
            trim: true,
            default:
                "https://res.cloudinary.com/deymewscv/image/upload/v1760774522/hqoltmqamhhjfz7divf1.jpg",
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },

        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
            sparse: true,
        },

        role: {
            type: String,
            default: "student",
        },

        admissionDate: {
            type: Date,
            default: Date.now,
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    { timestamps: true }
);



studentSchema.index({ authId: 1, academicYear: 1 }, { unique: true });

studentSchema.index({ rollNo: 1, class: 1, section: 1 });

studentSchema.index({ academicYear: 1 });



studentSchema.virtual("age").get(function (this: IStudent): number {
    const today = new Date();

    let age = today.getFullYear() - this.dob.getFullYear();

    const monthDiff = today.getMonth() - this.dob.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < this.dob.getDate())
    ) {
        age--;
    }

    return age;
});



export default mongoose.model<IStudent>(
    "Student",
    studentSchema,
    "students"
);