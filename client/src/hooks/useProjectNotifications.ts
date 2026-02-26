import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationAPI } from "@/services";
import type { ApiResponse } from "@/types";

export const useProjectNotifications = (projectId: string) => {
  const queryClient = useQueryClient();

  const { data: notificationData } = useQuery({
    queryKey: ["project-notifications", projectId],
    queryFn: () =>
      notificationAPI.get<ApiResponse<{ count: number }>>(
        `project/${projectId}/count`,
      ),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const notificationCount = notificationData?.data?.count || 0;

  const markProjectNotificationsAsRead = async () => {
    if (notificationCount > 0) {
      try {
        await notificationAPI.patch(undefined, `project/${projectId}/read`);
        await queryClient.invalidateQueries({
          queryKey: ["project-notifications", projectId],
        });
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  };

  return {
    notificationCount,
    markProjectNotificationsAsRead,
  };
};
