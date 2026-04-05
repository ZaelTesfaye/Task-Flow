import express, { Router } from "express";
import { notificationController } from "../controllers/index.js";

const router: Router = express.Router();

router.get("/unread", notificationController.getUnreadNotifications);

router.get("/project/:projectId/count", notificationController.getProjectNotificationCount);

router.patch("/:notificationId/read", notificationController.markNotificationAsRead);

router.patch("/project/:projectId/read", notificationController.markProjectNotificationsAsRead);

router.delete("/:notificationId", notificationController.deleteNotification);

export default router;
