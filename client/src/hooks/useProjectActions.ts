import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { projectAPI } from "@/lib/api";
import toast from "react-hot-toast";

export const useProjectActions = (
  projectId: string | string[] | undefined,
  refetch: () => void
) => {
  const router = useRouter();

  const updateProject = useCallback(
    async (data: { title: string; description: string }) => {
      await projectAPI.updateProject(projectId as string, data);
      toast.success("Project updated!");
      refetch();
    },
    [projectId, refetch]
  );

  const deleteProject = useCallback(async () => {
    await projectAPI.removeProject(projectId as string);
    toast.success("Project deleted!");
    router.push("/dashboard");
  }, [projectId, router]);

  return {
    updateProject,
    deleteProject,
  };
};
