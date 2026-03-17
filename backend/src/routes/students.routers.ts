import { Router } from "express";
import * as studentControllers from "../controllers/students.controller";

import authMiddleware from "../middleware/auth.middleware";

export const studentRouter = Router();


studentRouter.get(
  "/students",
  authMiddleware,
  studentControllers.getStudentsByClass
);

studentRouter.post(
  "/students",
  authMiddleware,
  studentControllers.addNewStudent
);

studentRouter.patch(
  "/students/profile-pic",
  authMiddleware,
  studentControllers.changeProfilePic
);

