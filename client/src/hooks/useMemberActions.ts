import { useCallback } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { projectAPI } from "@/lib";

export const useMemberActions = (
  projectId: string | string[] | undefined,
  refetch: () => void
) => {
  const queryClient = useQueryClient();

  const addMember = useCallback(
    async (data: { email: string; access: "admin" | "member" }) => {
      await projectAPI.addMember(projectId as string, data);
      toast.success("Invitation sent!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "invitations"],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  const removeMember = useCallback(
    async (userId: string) => {
      await projectAPI.removeProjectMember(projectId as string, userId);
      toast.success("Member removed!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "members"],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  const updateMemberAccess = useCallback(
    async (userId: string, access: "admin" | "member") => {
      await projectAPI.updateMember(projectId as string, userId, { access });
      toast.success("Member role updated!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "members"],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  const leaveProject = useCallback(
    async (userId: string) => {
      await projectAPI.leaveProject(projectId as string, userId as string);
      toast.success("You have left the project!");
      // Invalidate the user projects cache to remove this project from the dashboard
      await queryClient.invalidateQueries({ queryKey: ["user-projects"] });
    },
    [projectId, queryClient]
  );

  return {
    addMember,
    removeMember,
    updateMemberAccess,
    leaveProject,
  };
};
