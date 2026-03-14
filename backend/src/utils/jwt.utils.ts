import jwt, { Secret } from "jsonwebtoken";
import { AuthToken } from "../middleware/auth.middleware";


export const createToken = (payload: AuthToken) => {
    const jwtSecret = process.env.JWT_SECRET as Secret

    if (!jwtSecret) {
        throw new Error("JWT secret not configured");
    }

    return jwt.sign(payload, jwtSecret, { expiresIn: "1hr" });

}