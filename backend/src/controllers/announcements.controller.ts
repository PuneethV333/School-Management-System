import { Response, Request } from "express";
import { AuthToken } from "../middleware/auth.middleware";
import { redisClient } from "../config/redis";
import * as announcementServices from "../services/announcements.services";
import { setValKey } from "../utils/redis.utils";
import { getError } from "../utils/error.utils";
import { Attachment } from "../models/announcements.module";

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const page = 1;
    const limit = 5;

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR ;

    if (!academicYear) {
      throw new Error("Academic year not found");
    }

    const cacheKey = `announcements:home:${academicYear}:${page}:${limit}`;

    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const result: announcementServices.AnnouncementPagination =
      await announcementServices.getFiveAnnouncements(
        academicYear,
        limit,
        page,
      );

    const response = {
      success: true,
      data: result.data,
      page: result.page,
      totalPages: result.totalPages,
    };

    await setValKey(cacheKey, JSON.stringify(response), 300);

    return res
      .status(200)
      .json({ message: "fetched announcements", data: response });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};

export interface postAnnouncementInput {
  title: string;
  content: string;
  category: "General" | "Exam" | "Holiday" | "Event" | "Fee" | "Emergency";
  classes: number[];
  attachments?: Attachment[];
  expireAt: string;
}

export const postAnnouncements = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;
    if (!reqUser) {
      throw new Error("Auth token not found");
    }

    if (reqUser.role !== "authority") {
      return res
        .status(404)
        .json({ message: "Forbidden only authority can post announcements" });
    }

    const reqBody: postAnnouncementInput = req.body;

    if (!reqBody.title || !reqBody.content) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });
    }

    const allowedClasses = Array.from({ length: 10 }, (_, i) => i + 1);

    if (
      reqBody.classes.length &&
      !reqBody.classes.every((cls: number) => allowedClasses.includes(cls))
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid class value" });
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR as string;

    if (!academicYear) {
      throw new Error("Academic year not found");
    }

    const result = await announcementServices.createAnnouncements({
      ...reqBody,
      academicYear,
    });

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const cacheKey = `announcements:home:${academicYear}:${page}:${limit}`;

    await redisClient.del(cacheKey);

    const response = {
      success: true,
      data: result.data,
      page: result.page,
      totalPages: result.totalPages,
    };

    await setValKey(cacheKey, JSON.stringify(response), 300);

    return res.status(200).json({
      message: "Create a announcement",
      data: response,
    });
  } catch (err) {
    res.status(400).json(getError(err));
  }
};
