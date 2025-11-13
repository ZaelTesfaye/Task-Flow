import { useCallback } from "react";
import toast from "react-hot-toast";
import { categoryAPI } from "@/lib";

export const useCategoryActions = (
  projectId: string | string[] | undefined,
  refetch: () => void
) => {
  const createCategory = useCallback(
    async (name: string) => {
      await categoryAPI.createCategory(projectId as string, { name });
      toast.success("Category created!");
      refetch();
    },
    [projectId, refetch]
  );

  const deleteCategory = useCallback(
    async (categoryId: string) => {
      await categoryAPI.removeCategory(projectId as string, categoryId);
      toast.success("Category deleted!");
      refetch();
    },
    [projectId, refetch]
  );

  return {
    createCategory,
    deleteCategory,
  };
};
