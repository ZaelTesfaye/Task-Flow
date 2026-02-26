import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { projectAPI } from "@/lib";
import { useAuthContext } from "@/context";
import type { ProjectInvitation, ApiResponse } from "@/types";

/** Invitations count query for notification badges (used by Header) */
export const useInvitationsCount = () => {
  const { user } = useAuthContext();

  const { data: invitationsCount = 0 } = useQuery({
    queryKey: ["user-invitations"],
    queryFn: async () => {
      const response =
        await projectAPI.get<ApiResponse<ProjectInvitation[]>>("invitations");
      const pendingInvitations = response.data.filter(
        (inv: ProjectInvitation) => inv.status === "pending",
      );
      return pendingInvitations.length;
    },
    enabled: !!user,
    refetchOnWindowFocus: true,
  });

  return invitationsCount;
};

/** Full invitations management (used by Invitations page) */
export const useInvitations = () => {
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [invitationLoading, setInvitationLoading] = useState(false);
  const queryClient = useQueryClient();

  const loadInvitations = useCallback(async () => {
    try {
      setLoading(true);
      const response =
        await projectAPI.get<ApiResponse<ProjectInvitation[]>>("invitations");
      setInvitations(response.data || []);
    } catch (error) {
      console.error("Failed to load invitations", error);
      toast.error("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
    queryClient.refetchQueries({ queryKey: ["user-invitations"] });
    loadInvitations();
  }, [queryClient, loadInvitations]);

  const handleRespond = async (
    invitationId: string,
    action: "accept" | "decline",
  ) => {
    try {
      setInvitationLoading(true);
      await projectAPI.patch({ action }, `invitations/${invitationId}`);
      toast.success(
        action === "accept" ? "Invitation accepted!" : "Invitation declined.",
      );
      if (action === "accept") {
        await queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      }
      await queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
      loadInvitations();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Invitation response failed",
      );
    } finally {
      setInvitationLoading(false);
    }
  };

  return {
    invitations,
    loading,
    invitationLoading,
    loadInvitations,
    handleRespond,
  };
};
