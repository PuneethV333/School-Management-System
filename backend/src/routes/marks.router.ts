import { Router } from "express";
import * as marksController from "../controllers/marks.controller";
import authMiddleware from "../middleware/auth.middleware";

export const marksRouter = Router();

marksRouter.get("/ut/:classNo", authMiddleware, marksController.getUTMarks);
marksRouter.get("/student/ut/:classNo", authMiddleware, marksController.getUtMarksForStudent);
marksRouter.get("/exam/:classNo", authMiddleware, marksController.getExamMarks);
marksRouter.post("/ut/:classNo", authMiddleware, marksController.addUTMarks);
marksRouter.post("/exam/:classNo", authMiddleware, marksController.addExamMark);
