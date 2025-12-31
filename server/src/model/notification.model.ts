import prisma from "../lib/prisma.js";

export const createNotification = async (
  userId: string,
  type: string,
  message: string,
  taskId?: string,
  projectId?: string,
) => {
  return prisma.notification.create({
    data: {
      userId,
      type,
      message,
      taskId: taskId || null,
      projectId: projectId || null,
    },
  });
};

export const getUnreadNotificationsByUserId = async (userId: string) => {
  return prisma.notification.findMany({
    where: {
      userId,
      isRead: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getUnreadNotificationCountByProject = async (
  userId: string,
  projectId: string,
) => {
  return prisma.notification.count({
    where: {
      userId,
      projectId,
      isRead: false,
    },
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
    },
  });
};

export const markAllProjectNotificationsAsRead = async (
  userId: string,
  projectId: string,
) => {
  return prisma.notification.updateMany({
    where: {
      userId,
      projectId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
};

export const deleteNotification = async (notificationId: string) => {
  return prisma.notification.delete({
    where: {
      id: notificationId,
    },
  });
};
