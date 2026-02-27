import { useQueryClient } from "@tanstack/react-query";
import { projectApiClient } from "@/lib";

export const useInvitationActions = () => {
  const queryClient = useQueryClient();

  const respondToInvitation = async (invitationId: string, action: "accept" | "decline") => {
    await projectApiClient.patch({ action }, `invitations/${invitationId}`);
    if (action === "accept") {
      await queryClient.invalidateQueries({ queryKey: ["user-projects"] });
    }
    await queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
  };

  return { respondToInvitation };
};
