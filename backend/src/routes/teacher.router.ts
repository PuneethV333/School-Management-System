import { Router } from "express";
import * as teacherController from '../controllers/teacher.controller'
import authMiddleware from "../middleware/auth.middleware";

export const teacherRouter = Router();

teacherRouter.get('/',authMiddleware,teacherController.getTeachers);
teacherRouter.post('/newTeacher',authMiddleware,teacherController.addTeacher);

