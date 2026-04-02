import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectApi } from "@/lib";

export const useMemberMutations = (projectId: string) => {
  const queryClient = useQueryClient();

  const addMember = async (data: { email: string; access: "admin" | "member" }) => {
    await projectApi.post(data, `member/${projectId}`);
    toast.success("Invitation sent!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

  const removeMember = async (userId: string) => {
    await projectApi.delete(`member/${projectId}/${userId}`);
    toast.success("Member removed!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

  const updateMemberAccess = async (userId: string, access: "admin" | "member") => {
    await projectApi.patch({ access }, `member/${projectId}/${userId}`);
    toast.success("Member role updated!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

  const leaveProject = async (userId: string) => {
    await projectApi.delete(`member/${projectId}/${userId}`);
    toast.success("You have left the project!");
    await queryClient.invalidateQueries({ queryKey: ["user-projects"] });
  };

  return {
    addMember,
    removeMember,
    updateMemberAccess,
    leaveProject,
  };
};
