import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { projectApiClient } from "@/lib";
import { useAuthContext } from "@/context";
import type { UserProjectsResponse, ApiResponse, Project } from "@/types";

export const useUserProjects = () => {
  const { user, loading: authLoading } = useAuthContext();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["user-projects"],
    queryFn: () => projectApiClient.get<ApiResponse<UserProjectsResponse>>(),
    enabled: !!user && !authLoading,
  });

  const projects = projectsData?.data || { owner: [], admin: [], member: [] };

  const createProject = async (title: string, description: string) => {
    const response = await projectApiClient.post<{
      message: string;
      data: Project;
    }>({ title, description });
    const createdProject = response.data;
    toast.success("Project created successfully!");
    await queryClient.invalidateQueries({ queryKey: ["user-projects"] });
    if (createdProject?.id) {
      router.push(`/project?id=${createdProject.id}&createCategory=1`);
    }
  };

  return {
    projects,
    projectsLoading,
    authLoading,
    createProject,
  };
};
