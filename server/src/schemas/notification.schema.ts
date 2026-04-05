import { z } from "../lib/zod-openapi.js";
import { ApiSuccessResponseSchema } from "./api.schema.js";

export const NotificationSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    type: z.string(),
    message: z.string(),
    isRead: z.boolean(),
    projectId: z.string().uuid().nullable().optional(),
    taskId: z.string().uuid().nullable().optional(),
    createdAt: z.date(),
  })
  .openapi("Notification");

// Request Validation Schemas

export const MarkNotificationReadRequestSchema = {
  params: z.object({
    notificationId: z.string().uuid(),
  }),
};

// Response Schemas

export const NotificationsListResponseSchema = ApiSuccessResponseSchema(z.array(NotificationSchema)).openapi(
  "NotificationsListResponse",
);

export const MarkNotificationReadResponseSchema =
  ApiSuccessResponseSchema(NotificationSchema).openapi("MarkNotificationReadResponse");
