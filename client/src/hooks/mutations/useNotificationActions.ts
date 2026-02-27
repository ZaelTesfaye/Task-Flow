import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { notificationApiClient } from "@/lib";

export const useNotificationActions = (projectId?: string) => {
  const queryClient = useQueryClient();

  const markAsRead = async (notificationId: string) => {
    await notificationApiClient.patch({ read: true }, notificationId);
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markAllAsRead = async () => {
    await notificationApiClient.post({}, "mark-all-read");
    toast.success("All notifications marked as read!");
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const deleteNotification = async (notificationId: string) => {
    await notificationApiClient.delete(notificationId);
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const deleteAllNotifications = async () => {
    await notificationApiClient.delete("all");
    toast.success("All notifications deleted!");
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markProjectNotificationsAsRead = async () => {
    if (!projectId) return;
    await notificationApiClient.patch(undefined, `project/${projectId}/read`);
    await queryClient.invalidateQueries({
      queryKey: ["project-notifications", projectId],
    });
  };

  return {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    markProjectNotificationsAsRead,
  };
};
