import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { phaseApiClient } from "@/lib";

export const usePhaseMutations = (projectId: string) => {
  const queryClient = useQueryClient();

  const createPhase = async (name: string) => {
    await phaseApiClient.post({ name }, projectId);
    toast.success("Phase created!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

  const deletePhase = async (phaseId: string) => {
    await phaseApiClient.delete(`${projectId}/${phaseId}`);
    toast.success("Phase deleted!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

  return {
    createPhase,
    deletePhase,
  };
};
