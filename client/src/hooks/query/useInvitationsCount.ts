import { useQuery } from "@tanstack/react-query";

import { projectApiClient } from "@/lib";
import { useAuthContext } from "@/context";
import type { ProjectInvitation, ApiResponse } from "@/types";

/** Invitations count query for notification badges */
export const useInvitationsCount = () => {
  const { user } = useAuthContext();

  const { data: invitationsCount = 0 } = useQuery({
    queryKey: ["user-invitations"],
    queryFn: async () => {
      const response = await projectApiClient.get<ApiResponse<ProjectInvitation[]>>("invitations");
      const pendingInvitations = response.data.filter((inv: ProjectInvitation) => inv.status === "pending");
      return pendingInvitations.length;
    },
    enabled: !!user,
    refetchOnWindowFocus: true,
  });

  return invitationsCount;
};
