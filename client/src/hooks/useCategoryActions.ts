import { useCallback } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { categoryAPI } from "@/lib";

export const useCategoryActions = (
  projectId: string | string[] | undefined,
  refetch: () => void
) => {
  const queryClient = useQueryClient();

  const createCategory = useCallback(
    async (name: string) => {
      await categoryAPI.createCategory(projectId as string, { name });
      toast.success("Category created!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "categories"],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  const deleteCategory = useCallback(
    async (categoryId: string) => {
      await categoryAPI.removeCategory(projectId as string, categoryId);
      toast.success("Category deleted!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "categories"],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  return {
    createCategory,
    deleteCategory,
  };
};
