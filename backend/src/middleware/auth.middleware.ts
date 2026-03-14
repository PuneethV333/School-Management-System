import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redisClient } from "../config/redis";

declare global {
    namespace Express {
        interface Request {
            user?: {
                authId: string;
                role: string;
            };
        }
    }
}

export interface AuthToken extends JwtPayload {
    authId: string;
    role: "teacher" | "student" | "authority";
}

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }


        const session = await redisClient.get(`session:${token}`);

        if (!session) {
            return res.status(401).json({
                message: "Session expired"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as AuthToken;

        req.user = {
            authId: decoded.authId,
            role: decoded.role,
        };

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

export default authMiddleware;