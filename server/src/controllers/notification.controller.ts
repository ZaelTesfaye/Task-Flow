import type { Request, Response, RequestHandler } from "express";
import { z } from "zod";
import { asyncWrapper } from "../lib/index.js";
import { notificationServices } from "../services/index.js";
import { NotificationsListResponseSchema } from "../schemas/index.js";

export const getUnreadNotifications: RequestHandler = asyncWrapper(
  async (req: Request, res: Response<z.infer<typeof NotificationsListResponseSchema>>) => {
    const { id: userId } = req.user!;

    const notifications = await notificationServices.getUnreadNotifications(userId);

    res.json({
      message: "Unread notifications retrieved successfully",
      data: notifications,
    });
  },
);

export const getProjectNotificationCount: RequestHandler = asyncWrapper(
  async (req: Request<{ projectId: string }>, res: Response<z.infer<typeof NotificationsListResponseSchema>>) => {
    const { id: userId } = req.user!;
    const { projectId } = req.params;

    const count = await notificationServices.getProjectNotificationCount(userId, projectId);

    res.json({
      message: "Project notification count retrieved successfully",
      data: { count } as any,
    });
  },
);

export const markNotificationAsRead: RequestHandler = asyncWrapper(
  async (req: Request<{ notificationId: string }>, res: Response<z.infer<typeof NotificationsListResponseSchema>>) => {
    const { notificationId } = req.params;

    await notificationServices.markNotificationRead(notificationId);

    res.json({
      message: "Notification marked as read",
      data: [] as any,
    });
  },
);

export const markProjectNotificationsAsRead: RequestHandler = asyncWrapper(
  async (
    req: Request<{ projectId: string }>,
    res: Response<z.infer<typeof NotificationsListResponseSchema>>,
  ) => {
    const { id: userId } = req.user!;
    const { projectId } = req.params;

    await notificationServices.markProjectNotificationsRead(userId, projectId);

    res.json({
      message: "Project notifications marked as read",
      data: [] as any,
    });
  },
);

export const deleteNotification: RequestHandler = asyncWrapper(
  async (req: Request<{ notificationId: string }>, res: Response<z.infer<typeof NotificationsListResponseSchema>>) => {
    const { notificationId } = req.params;

    await notificationServices.deleteNotificationById(notificationId);

    res.json({
      message: "Notification deleted successfully",
      data: [] as any,
    });
  },
);
