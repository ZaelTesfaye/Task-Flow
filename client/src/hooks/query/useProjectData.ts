import { useQuery, useQueryClient } from "@tanstack/react-query";

import { projectApi, phaseApi } from "@/lib";
import { useAuthContext } from "@/context";
import type { ProjectMember, ApiResponse, TasksResponse, ProjectInvitation } from "@/types";

export const useProjectData = (projectId: string | string[] | undefined) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const {
    data: phasesData,
    isLoading: phasesLoading,
    error: phasesError,
  } = useQuery({
    queryKey: ["project", projectId, "phases"],
    queryFn: () => phaseApi.get<ApiResponse<TasksResponse>>(projectId as string),
    enabled: !!projectId && !!user,
    retry: false,
  });

  const {
    data: membersData,
    isLoading: membersLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["project", projectId, "members"],
    queryFn: () => projectApi.get<ApiResponse<ProjectMember[]>>(`member/${projectId as string}`),
    enabled: !!projectId && !!user,
    retry: false,
  });

  const members = membersData?.data || [];
  const currentMember = members.find((m: ProjectMember) => m.userId === user?.id);
  const userRole = (currentMember?.access || "member") as "owner" | "admin" | "member";

  const { data: invitationsData, isLoading: invitationsLoading } = useQuery({
    queryKey: ["project", projectId, "invitations"],
    queryFn: () => projectApi.get<ApiResponse<ProjectInvitation[]>>(`member/${projectId as string}/invitations`),
    enabled: !!projectId && !!user && (userRole === "owner" || userRole === "admin"),
    retry: false,
  });

  if (phasesError || membersError) {
    // toast.error("Failed to fetch project data");
    // router.push("/dashboard");
  }

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["project", projectId] });
  };

  return {
    project: phasesData?.data?.project || null,
    phases: phasesData?.data?.phases || [],
    members,
    invitations: invitationsData?.data || [],
    loading: phasesLoading || membersLoading || invitationsLoading,
    userRole,
    refetch,
  };
};
