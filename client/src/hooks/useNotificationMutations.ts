import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { notificationClient } from "@/lib";

export const useNotificationMutations = () => {
  const queryClient = useQueryClient();

  const markAsRead = async (notificationId: string) => {
    await notificationClient.patch({ read: true }, notificationId);
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markAllAsRead = async () => {
    await notificationClient.post({}, "mark-all-read");
    toast.success("All notifications marked as read!");
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const deleteNotification = async (notificationId: string) => {
    await notificationClient.delete(notificationId);
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const deleteAllNotifications = async () => {
    await notificationClient.delete("all");
    toast.success("All notifications deleted!");
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  };
};
