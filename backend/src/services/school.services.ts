import announcements, { IAnnouncement } from "../models/announcements.module";
import School, { ISchool } from "../models/school.module";

export const getData = async (academicYear: string): Promise<ISchool> => {
  try {
    const data = await School.findOne({ academicYear }).lean();

    if (!data) {
      throw new Error("School info not found");
    }

    return data;
  } catch (err) {
    throw err;
  }
};

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
    if (!academicYear || academicYear === 'undefined') {
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
