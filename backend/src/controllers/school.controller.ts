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
