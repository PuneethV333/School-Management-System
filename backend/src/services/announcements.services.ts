import { postAnnouncementInput } from "../controllers/announcements.controller";
import announcements, {
Attachment,
IAnnouncement,
} from "../models/announcements.module";

export interface AnnouncementPagination {
data: IAnnouncement[];
total: number;
page: number;
totalPages: number;
}

export const getFiveAnnouncements = async (
academicYear: string,
limit = 5,
page = 1,
): Promise<AnnouncementPagination> => {
try {
    if (!academicYear || academicYear === "undefined") {
    throw new Error("Provide all inputs");
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
    announcements
        .find({
        academicYear,
        isActive: true,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

    announcements.countDocuments({
        academicYear,
        isActive: true,
    }),
    ]);

    return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    };
} catch (err) {
    throw err;
}
};

export interface createAnnouncementsInput {
title: string;
content: string;
category: "General" | "Exam" | "Holiday" | "Event" | "Fee" | "Emergency";
classes: number[];
attachments?: Attachment[];
expireAt: string;
academicYear: string;
}

export const createAnnouncements = async ({
title,
content,
category,
classes,
attachments,
academicYear,
expireAt,
}: createAnnouncementsInput) => {
try {
    const newAnnouncement = await announcements.create({
    title,
    content,
    category,
    classes,
    attachments,
    expireAt:   expireAt? new Date(expireAt):undefined,
    academicYear
    });
    
    const data = await getFiveAnnouncements(academicYear);
    
    return data;
    
} catch (err) {
    throw err;
}
};
