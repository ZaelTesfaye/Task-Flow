import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { projectApi } from "@/lib";
import type { ProjectInvitation, ApiResponse } from "@/types";

/** Full invitations query (used by Invitations page) */
export const useInvitations = () => {
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const loadInvitations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectApi.get<ApiResponse<ProjectInvitation[]>>("invitations");
      setInvitations(response.data || []);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
    queryClient.refetchQueries({ queryKey: ["user-invitations"] });
    loadInvitations();
  }, [queryClient, loadInvitations]);

  return {
    invitations,
    loading,
    loadInvitations,
  };
};
