import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectAPI } from "@/lib";

export const useProjectMutations = (projectId: string) => {
  const queryClient = useQueryClient();

  const updateProject = async (data: {
    title: string;
    description: string;
  }) => {
    await projectAPI.patch(data, projectId);
    toast.success("Project updated!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

  const deleteProject = async () => {
    await projectAPI.delete(projectId);
    toast.success("Project deleted!");
    await queryClient.invalidateQueries({ queryKey: ["user-projects"] });
  };

  return {
    updateProject,
    deleteProject,
  };
};
