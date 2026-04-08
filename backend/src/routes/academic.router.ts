import { Router } from "express";
import * as academicController from '../controllers/academic.controller'
import authMiddleware from "../middleware/auth.middleware";

export const academicRouter = Router()

academicRouter.get('/timetable/:classNo',authMiddleware,academicController.getTimeTableByClass)
academicRouter.get('/syllabus/:classNo', authMiddleware, academicController.getSyllabus)

