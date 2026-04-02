import { useQuery } from "@tanstack/react-query";
import { notificationApi } from "@/lib";
import type { ApiResponse } from "@/types";

export const useProjectNotifications = (projectId: string) => {
  const { data: notificationData } = useQuery({
    queryKey: ["project-notifications", projectId],
    queryFn: () => notificationApi.get<ApiResponse<{ count: number }>>(`project/${projectId}/count`),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const notificationCount = notificationData?.data?.count || 0;

  return { notificationCount };
};
