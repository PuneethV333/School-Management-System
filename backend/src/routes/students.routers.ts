import { Router } from "express";
import * as studentControllers from "../controllers/students.controller";

import authMiddleware from "../middleware/auth.middleware";

export const studentRouter = Router();

studentRouter.post(
    "/profile-pic",
    authMiddleware,
    studentControllers.changeProfilePic,
);

studentRouter.post("/", authMiddleware, studentControllers.addNewStudent);

studentRouter.get(
    "/:classNo/:section",
    authMiddleware,
    studentControllers.getStudentsByClass,
);
studentRouter.get(
    "/:id",
    authMiddleware,
    studentControllers.getAllStudentsById,
);
