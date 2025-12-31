import express, { Router } from "express";
import { notificationController } from "../controllers/index.js";

const router: Router = express.Router();

// Get all unread notifications
router.get("/unread", notificationController.getUnreadNotifications);

// Get notification count for a specific project
router.get(
  "/project/:projectId/count",
  notificationController.getProjectNotificationCount,
);

// Mark a specific notification as read
router.patch(
  "/:notificationId/read",
  notificationController.markNotificationAsRead,
);

// Mark all notifications for a project as read
router.patch(
  "/project/:projectId/read",
  notificationController.markProjectNotificationsAsRead,
);

// Delete a notification
router.delete("/:notificationId", notificationController.deleteNotification);

export default router;
