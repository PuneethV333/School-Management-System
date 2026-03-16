import { Router } from "express";
import * as announcementsController from '../controllers/announcements.controller'
import authMiddleware from "../middleware/auth.middleware";


const announcementsRoute = Router()


announcementsRoute.get('/announcements',authMiddleware,announcementsController.getAnnouncements)