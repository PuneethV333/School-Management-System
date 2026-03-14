import { NextFunction,Response,Request } from "express"

export const redisMiddleware = (_: Request, res: Response, next: NextFunction) => {
    res.set("Cache-Control", "no-store")
    next()
}