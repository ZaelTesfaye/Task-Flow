import { notificationModel } from "../model/index.js";

export const createTaskAssignedNotification = async (
  userId: string,
  taskId: string,
  projectId: string,
  taskTitle: string,
  assignerName: string,
) => {
  const message = `${assignerName} assigned you a new task: "${taskTitle}"`;
  return notificationModel.createNotification(
    userId,
    "task_assigned",
    message,
    taskId,
    projectId,
  );
};

export const getUnreadNotifications = async (userId: string) => {
  return notificationModel.getUnreadNotificationsByUserId(userId);
};

export const getProjectNotificationCount = async (
  userId: string,
  projectId: string,
) => {
  return notificationModel.getUnreadNotificationCountByProject(
    userId,
    projectId,
  );
};

export const markNotificationRead = async (notificationId: string) => {
  return notificationModel.markNotificationAsRead(notificationId);
};

export const markProjectNotificationsRead = async (
  userId: string,
  projectId: string,
) => {
  return notificationModel.markAllProjectNotificationsAsRead(userId, projectId);
};

export const deleteNotificationById = async (notificationId: string) => {
  return notificationModel.deleteNotification(notificationId);
};
