import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { projectAPI, taskAPI } from "@/lib";
import { useAuth } from "@/context";
import { ProjectMember } from "@/types";

export const useProjectData = (projectId: string | string[] | undefined) => {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: phasesData,
    isLoading: phasesLoading,
    error: phasesError,
  } = useQuery({
    queryKey: ["project", projectId, "phases"],
    queryFn: () => taskAPI.getPhases(projectId as string),
    enabled: !!projectId && !!user,
    retry: false,
  });

  const {
    data: membersData,
    isLoading: membersLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["project", projectId, "members"],
    queryFn: () => projectAPI.getProjectMembers(projectId as string),
    enabled: !!projectId && !!user,
    retry: false,
  });

  const members = membersData?.data || [];
  const currentMember = members.find(
    (m: ProjectMember) => m.userId === user?.id
  );
  const userRole = (currentMember?.access || "member") as
    | "owner"
    | "admin"
    | "member";

  const { data: invitationsData, isLoading: invitationsLoading } = useQuery({
    queryKey: ["project", projectId, "invitations"],
    queryFn: () => projectAPI.getProjectInvitations(projectId as string),
    enabled:
      !!projectId && !!user && (userRole === "owner" || userRole === "admin"),
    retry: false,
  });

  if (phasesError || membersError) {
    console.error("Failed to fetch project data:", phasesError || membersError);
    // Only redirect if it's a permission error or not found, but for now let's keep it simple
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
