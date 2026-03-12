// import mongoose, { Schema, Document } from "mongoose";


// export interface day {
//     date: Date
//     attendanceCount: number
// }

// const daySchema = new Schema<day>(
//     {
//         date: {
//             type: Date,
//             required: true,
//         },

//         attendanceCount: {
//             type: Number,
//             default: null,
//             min: 0,
//         },
//     },
//     { _id: false }
// );

// export interface week{
//     weekNumber:number;
//     days:day[];
//     totalAttendance:number  
// }


// const weekSchema = new Schema<week>(
//     {
//         weekNumber: {
//             type: Number,
//             required: true,
//             min: 1,
//             max: 53,
//         },
//         days: {
//             type: [daySchema],
//             default: [],
//         },
//         totalAttendance: {
//             type: Number,
//             default: null,
//         },
//     },
//     { _id: false }
// );

// export interface month {
//     monthNumber:number
//     weeks:week[]
//     totalAttendance:number
// }


// const monthSchema = new Schema<month>(
//     {
//         monthNumber: {
//             type: Number,
//             required: true,
//             min: 1,
//             max: 12,
//         },
//         weeks: {
//             type: [weekSchema],
//             default: [],
//         },
//         totalAttendance: {
//             type: Number,
//             default: null,
//         },
//     },
//     { _id: false }
// );

// export interface year{
//     yearNumber:number
//     months:month[]
//     totalAttendance:number
// }

// const yearSchema = new Schema<year>(
//     {
//         yearNumber: {
//             type: Number,
//             required: true,
//         },
//         months: {
//             type: [monthSchema],
//             default: [],
//         },
//         totalAttendance: {
//             type: Number,
//             default: null,
//         },
//     },
//     { _id: false }
// );

// export interface school extends Document{
//     schoolName:string
//     academicYear:string
//     address:string
//     principalName:string
//     shift:"Morning" | "Evening"
//     totNoOfStudents:number
//     totNoOfBoys:number
//     totNoOfGirls:number
//     totNoOfOthers:number
//     totNoOfTeachers:number
//     attendanceYears:year[]
// }

// const schoolSchema = new Schema<school>(
//     {
//         schoolName: {
//             type: String,
//             required: true,
//         },
//         academicYear: {
//             type: String,
//         },
//         address: String,
//         principalName: String,
//         shift: {
//             type: String,
//             enum: ["Morning", "Evening"],
//             default: "Morning",
//         },

//         totNoOfStudents: { type: Number, required: true, min: 0 },
//         totNoOfBoys: { type: Number, required: true, min: 0 },
//         totNoOfGirls: { type: Number, required: true, min: 0 },
//         totNoOfOthers: { type: Number, required: true, min: 0 },
//         totNoOfTeachers: { type: Number, required: true, min: 0 },

//         attendanceYears: {
//             type: [yearSchema],
//             default: [],
//         },
//     },
//     { timestamps: true }
// );

// schoolSchema.virtual("totalStudents").get(function () {
//     return this.totNoOfBoys + this.totNoOfGirls + this.totNoOfOthers;
// });

//TODO: rewrite it later

// // schoolSchema.statics.initializeAttendance = async function (academicYear) {
// //     const CalendarOfEvents = mongoose.model("CalendarOfEvents");

// //     const calendarDoc = await CalendarOfEvents.findOne({ academicYear });

// //     if (!calendarDoc) {
// //         throw new Error("CalendarOfEvents not found for academic year");
// //     }

// //     const workingDays = calendarDoc.calendar.filter(
// //         (d) => d.type === "WORKING_DAY"
// //     );

// //     const yearNumber = parseInt(academicYear.split("-")[0]);

// //     const monthsMap = new Map();

// //     for (const entry of workingDays) {
// //         const date = new Date(entry.date);

// //         const monthNumber = date.getMonth() + 1;
// //         const weekNumber = getWeekNumber(date);

// //         if (!monthsMap.has(monthNumber)) {
// //             monthsMap.set(monthNumber, new Map());
// //         }

// //         const weeksMap = monthsMap.get(monthNumber);

// //         if (!weeksMap.has(weekNumber)) {
// //             weeksMap.set(weekNumber, {
// //                 weekNumber,
// //                 days: [],
// //                 totalAttendance: null,
// //             });
// //         }

// //         weeksMap.get(weekNumber).days.push({
// //             date,
// //             attendanceCount: null,
// //         });
// //     }

// //     const months = [];

// //     for (const [monthNumber, weeksMap] of monthsMap) {
// //         months.push({
// //             monthNumber,
// //             weeks: Array.from(weeksMap.values()),
// //             totalAttendance: null,
// //         });
// //     }

// //     return [
// //         {
// //             yearNumber,
// //             months,
// //             totalAttendance: null,
// //         },
// //     ];
// // };

// function getWeekNumber(date: Date) {
//   const temp = new Date(date.getTime());
//   temp.setHours(0, 0, 0, 0);

//   temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));

//   const week1 = new Date(temp.getFullYear(), 0, 4);

//   return (
//     1 +
//     Math.round(
//       ((temp.getTime() - week1.getTime()) / 86400000 -
//         3 +
//         ((week1.getDay() + 6) % 7)) /
//         7
//     )
//   );
// }

// export default mongoose.model("School", schoolSchema, "schools");



import mongoose, { Schema } from "mongoose";



export interface IDay {
    date: Date;
    attendanceCount?: number;
}

const daySchema = new Schema<IDay>(
    {
        date: {
            type: Date,
            required: true,
        },

        attendanceCount: {
            type: Number,
            min: 0,
            default: undefined,
        },
    },
    { _id: false }
);



export interface IWeek {
    weekNumber: number;
    days: IDay[];
    totalAttendance?: number;
}

const weekSchema = new Schema<IWeek>(
    {
        weekNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 53,
        },

        days: {
            type: [daySchema],
            default: [],
        },

        totalAttendance: {
            type: Number,
            min: 0,
            default: undefined,
        },
    },
    { _id: false }
);



export interface IMonth {
    monthNumber: number;
    weeks: IWeek[];
    totalAttendance?: number;
}

const monthSchema = new Schema<IMonth>(
    {
        monthNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },

        weeks: {
            type: [weekSchema],
            default: [],
        },

        totalAttendance: {
            type: Number,
            min: 0,
            default: undefined,
        },
    },
    { _id: false }
);



export interface IYear {
    yearNumber: number;
    months: IMonth[];
    totalAttendance?: number;
}

const yearSchema = new Schema<IYear>(
    {
        yearNumber: {
            type: Number,
            required: true,
        },

        months: {
            type: [monthSchema],
            default: [],
        },

        totalAttendance: {
            type: Number,
            min: 0,
            default: undefined,
        },
    },
    { _id: false }
);



export interface ISchool {
    schoolName: string;
    academicYear?: string;
    address?: string;
    principalName?: string;

    shift: "Morning" | "Evening";

    totNoOfStudents: number;
    totNoOfBoys: number;
    totNoOfGirls: number;
    totNoOfOthers: number;
    totNoOfTeachers: number;

    attendanceYears: IYear[];

    totalStudents?: number;
}

const schoolSchema = new Schema<ISchool>(
    {
        schoolName: {
            type: String,
            required: true,
            trim: true,
        },

        academicYear: {
            type: String,
            trim: true,
        },

        address: {
            type: String,
            trim: true,
        },

        principalName: {
            type: String,
            trim: true,
        },

        shift: {
            type: String,
            enum: ["Morning", "Evening"],
            default: "Morning",
        },

        totNoOfStudents: {
            type: Number,
            required: true,
            min: 0,
        },

        totNoOfBoys: {
            type: Number,
            required: true,
            min: 0,
        },

        totNoOfGirls: {
            type: Number,
            required: true,
            min: 0,
        },

        totNoOfOthers: {
            type: Number,
            required: true,
            min: 0,
        },

        totNoOfTeachers: {
            type: Number,
            required: true,
            min: 0,
        },

        attendanceYears: {
            type: [yearSchema],
            default: [],
        },
    },
    { timestamps: true }
);



schoolSchema.virtual("totalStudents").get(function () {
    return (
        this.totNoOfBoys +
        this.totNoOfGirls +
        this.totNoOfOthers
    );
});



function getWeekNumber(date: Date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);

    const dayDiff =
        Math.floor(
            (date.getTime() - startOfYear.getTime()) /
            (24 * 60 * 60 * 1000)
        ) +
        startOfYear.getDay() +
        1;

    return Math.ceil(dayDiff / 7);
}



export default mongoose.model<ISchool>(
    "School",
    schoolSchema,
    "schools"
);