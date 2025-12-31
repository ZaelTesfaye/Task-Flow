import { useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import { projectAPI } from "@/lib/api";

export const useProjectActions = (
  projectId: string | string[] | undefined,
  refetch: () => void
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateProject = useCallback(
    async (data: { title: string; description: string }) => {
      await projectAPI.updateProject(projectId as string, data);
      toast.success("Project updated!");
      await queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  const deleteProject = useCallback(async () => {
    await projectAPI.removeProject(projectId as string);
    toast.success("Project deleted!");
    await queryClient.invalidateQueries({ queryKey: ["user-projects"] });
    router.push("/dashboard");
  }, [projectId, router, queryClient]);

  return {
    updateProject,
    deleteProject,
  };
};
