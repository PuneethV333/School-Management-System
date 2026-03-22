import { Router } from "express";
import * as studentControllers from "../controllers/students.controller";

import authMiddleware from "../middleware/auth.middleware";

export const studentRouter = Router();


studentRouter.get(
  "/:classNo/:section",
  authMiddleware,
  studentControllers.getStudentsByClass
);

studentRouter.post(
  "/",
  authMiddleware,
  studentControllers.addNewStudent
);

studentRouter.patch(
  "/profile-pic",
  authMiddleware,
  studentControllers.changeProfilePic
);

