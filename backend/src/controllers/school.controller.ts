import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { AuthToken } from "../middleware/auth.middleware";
import * as schoolServices from "../services/school.services";

export const getSchoolInfo = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR;

    if (!academicYear) {
      throw new Error("Academic year not configured");
    }

    const data = await schoolServices.getData(academicYear);

    return res.status(200).json({
      message: "School info fetched",
      data,
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};

export const getAnnouncementsHomePage = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR as string;

    if (!academicYear) {
      throw new Error("Academic year not found");
    }

    const result: schoolServices.AnnouncementPagination =
      await schoolServices.getFiveAnnouncements(academicYear, limit, page);

    return res.status(200).json({
      success: true,
      message: "Announcements fetched successfully",
      data: result.data,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};
