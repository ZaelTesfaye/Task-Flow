import { useQueryClient } from "@tanstack/react-query";
import { projectApi } from "@/lib";

export const useInvitationActions = () => {
  const queryClient = useQueryClient();

  const respondToInvitation = async (invitationId: string, action: "accept" | "decline") => {
    await projectApi.patch({ action }, `invitations/${invitationId}`);
    if (action === "accept") {
      await queryClient.invalidateQueries({ queryKey: ["user-projects"] });
    }
    await queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
  };

  return { respondToInvitation };
};
