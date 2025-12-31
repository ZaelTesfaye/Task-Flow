import { useCallback } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { phaseAPI } from "@/lib";

export const usePhaseActions = (
  projectId: string | string[] | undefined,
  refetch: () => void
) => {
  const queryClient = useQueryClient();

  const createPhase = useCallback(
    async (name: string) => {
      await phaseAPI.createPhase(projectId as string, { name });
      toast.success("Phase created!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "phases"],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  const deletePhase = useCallback(
    async (phaseId: string) => {
      await phaseAPI.removePhase(projectId as string, phaseId);
      toast.success("Phase deleted!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "phases"],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  return {
    createPhase,
    deletePhase,
  };
};
