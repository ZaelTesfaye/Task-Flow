import { useCallback } from "react";
import toast from "react-hot-toast";
import { projectAPI } from "@/lib";

export const useMemberActions = (
  projectId: string | string[] | undefined,
  refetch: () => void
) => {
  const addMember = useCallback(
    async (data: { email: string; access: "admin" | "member" }) => {
      await projectAPI.addMember(projectId as string, data);
      toast.success("Invitation sent!");
      refetch();
    },
    [projectId, refetch]
  );

  const removeMember = useCallback(
    async (userId: string) => {
      await projectAPI.removeProjectMember(projectId as string, userId);
      toast.success("Member removed!");
      refetch();
    },
    [projectId, refetch]
  );

  const updateMemberAccess = useCallback(
    async (userId: string, access: "admin" | "member") => {
      await projectAPI.updateMember(projectId as string, userId, { access });
      toast.success("Member role updated!");
      refetch();
    },
    [projectId, refetch]
  );

  return {
    addMember,
    removeMember,
    updateMemberAccess,
  };
};
