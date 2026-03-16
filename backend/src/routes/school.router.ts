import { Router } from "express";
import * as schoolController from "../controllers/school.controller";
import authMiddleware from "../middleware/auth.middleware";

export const schoolRouter = Router();

schoolRouter.get("/schoolInfo", authMiddleware, schoolController.getSchoolInfo);
