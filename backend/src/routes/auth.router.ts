import { Router } from 'express'
import * as AuthController from '../controllers/auth.controller'
import authMiddleware from '../middleware/auth.middleware'

export const authRouter = Router()

authRouter.post("/login",AuthController.login)
authRouter.post("/logout",AuthController.logout)
authRouter.get('/getMe',authMiddleware,AuthController.getMe)
authRouter.post('/changePassword',authMiddleware,AuthController.changePassword)