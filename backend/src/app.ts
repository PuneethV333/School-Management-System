import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { errorHanding } from "./middleware/errorHandling.middleware";
import { redisMiddleware } from "./middleware/redis.middleware";
import { authRouter } from "./routes/auth.router";
import { studentRouter } from "./routes/students.routers";
import { schoolRouter } from "./routes/school.router";
import { announcementsRoute } from "./routes/announcements.route";
import { teacherRouter } from "./routes/teacher.router";
import { academicRouter } from "./routes/academic.router";
import { marksRouter } from "./routes/marks.router";
import { attendanceRouter } from "./routes/attendance.router";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(compression());

app.use(
  cors({
    origin: process.env.VITE_FRONTEND_URL,
    credentials: true,
  }),
);

app.use(redisMiddleware);

app.use("/auth", authRouter);
app.use("/school", schoolRouter);
app.use("/student", studentRouter);
app.use("/announcement", announcementsRoute);
app.use("/teachers", teacherRouter);
app.use("/academic", academicRouter);
app.use("/marks", marksRouter);
app.use("/attendance", attendanceRouter);

app.get("/test", (_: Request, res: Response) => {
  res.send("Server is running");
});

app.use((_: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHanding);

export default app;
