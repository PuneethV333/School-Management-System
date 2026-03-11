import express, { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import rateLimit from "express-rate-limit"
import morgan from "morgan"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

app.use(morgan("dev"))
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cookieParser())
app.use(compression())

app.use(
  cors({
    origin: process.env.VITE_FRONTEND_URL,
    credentials: true
  })
)

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

app.use((req: Request, res: Response, next: NextFunction) => {
  res.set("Cache-Control", "no-store")
  next()
})

app.get("/test", (_: Request, res: Response) => {
  res.send("Server is running")
})

export default app