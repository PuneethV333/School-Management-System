import { Router } from "express";
import * as announcementsController from '../controllers/announcements.controller'
import authMiddleware from "../middleware/auth.middleware";


export const announcementsRoute = Router()


announcementsRoute.get('/',authMiddleware,announcementsController.getAnnouncements)
announcementsRoute.post('/',authMiddleware,announcementsController.postAnnouncements)