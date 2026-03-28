import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import * as attendanceController from '../controllers/attendance.controller'

export const attendanceRouter = Router();

attendanceRouter.get('/my',authMiddleware,attendanceController.getMyAttendance);
attendanceRouter.get('/all/teacher',authMiddleware,attendanceController.getAllTeacherAttendanceData)
attendanceRouter.get('/all/student',authMiddleware,attendanceController.getAllStudentAttendanceData)
attendanceRouter.get('/class/:classNo',authMiddleware,attendanceController.getClassAttendanceData);
attendanceRouter.get('/students/:classNo',authMiddleware,attendanceController.getStudentAttendanceDataAccClass);