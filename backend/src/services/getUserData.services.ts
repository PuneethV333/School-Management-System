import Student from "../models/student.module";
import Teacher from "../models/teacher.module";
import Authority from "../models/authority.module";
import { setValKey } from "../utils/redis.utils";


export interface getUserDateInput {
    authId: string;
    role: "teacher" | "student" | "authority";
}

export const getUserData = async ({ authId, role }: getUserDateInput) => {
    try {

        if (!authId || !role) {
            throw new Error("no inputs")
        }

        let userData;
        if (role === "student")
            userData = await Student.findOne({ authId });
        else if (role === "teacher")
            userData = await Teacher.findOne({ authId });
        else userData = await Authority.findOne({ authId });

        if (!userData) {
            throw new Error("Invalid userData")
        }
        
        const cacheKey = "userData" as string
        
        await setValKey(cacheKey,JSON.stringify(userData),3600)

        return userData;
    } catch (err: any) {
        throw err;
    }
}

