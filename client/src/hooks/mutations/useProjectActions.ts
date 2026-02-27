import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectApiClient } from "@/lib";
import type { Project } from "@/types";

export const useProjectActions = (projectId: string) => {
  const queryClient = useQueryClient();

  const updateProject = async (data: {
    title: string;
    description: string;
  }) => {
    await projectApiClient.patch(data, projectId);
    toast.success("Project updated!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

  const deleteProject = async () => {
    await projectApiClient.delete(projectId);
    toast.success("Project deleted!");
    await queryClient.invalidateQueries({ queryKey: ["user-projects"] });
  };

  const createProject = async (title: string, description: string) => {
    const response = await projectApiClient.post<{
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
