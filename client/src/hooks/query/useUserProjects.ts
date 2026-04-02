import { useQuery } from "@tanstack/react-query";

import { projectApi } from "@/lib";
import { useAuthContext } from "@/context";
import type { UserProjectsResponse, ApiResponse } from "@/types";

export const useUserProjects = () => {
  const { user, loading: authLoading } = useAuthContext();

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["user-projects"],
    queryFn: () => projectApi.get<ApiResponse<UserProjectsResponse>>(),
    enabled: !!user && !authLoading,
  });

  const projects = projectsData?.data || { owner: [], admin: [], member: [] };

  return {
    projects,
    projectsLoading,
    authLoading,
  };
};
