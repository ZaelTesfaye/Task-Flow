import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectApi } from "@/lib";
import type { Project } from "@/types";

export const useProjectMutations = (projectId: string) => {
  const queryClient = useQueryClient();

  const updateProject = async (data: { title: string; description: string }) => {
    await projectApi.patch(data, projectId);
    toast.success("Project updated!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

  const deleteProject = async () => {
    await projectApi.delete(projectId);
    toast.success("Project deleted!");
    await queryClient.invalidateQueries({ queryKey: ["user-projects"] });
  };

  const createProject = async (title: string, description: string) => {
    const response = await projectApi.post<{
      message: string;
      data: Project;
    }>({ title, description });
    await queryClient.invalidateQueries({ queryKey: ["user-projects"] });
    return response.data;
  };

  return {
    createProject,
    updateProject,
    deleteProject,
  };
};
