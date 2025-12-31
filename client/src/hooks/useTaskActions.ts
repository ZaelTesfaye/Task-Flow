import { useCallback } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import { taskAPI } from "@/lib";
import { TaskStatus } from "@/types";

export const useTaskActions = (
  projectId: string | string[] | undefined,
  refetch: () => void
) => {
  const queryClient = useQueryClient();

  const createTask = useCallback(
    async (
      categoryId: string,
      data: { title: string; description: string; assignedTo: string }
    ) => {
      await taskAPI.createTask(projectId as string, categoryId, data);
      toast.success("Task created!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "categories"],
      });
      // Invalidate notification count for this project
      await queryClient.invalidateQueries({
        queryKey: ["project-notifications", projectId],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  const updateTask = useCallback(
    async (taskId: string, data: { title: string; description: string }) => {
      await taskAPI.updateTask(projectId as string, taskId, data);
      toast.success("Task updated!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "categories"],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      await taskAPI.removeTask(projectId as string, taskId);
      toast.success("Task deleted!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "categories"],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      await taskAPI.updateTask(projectId as string, taskId, { status });
      toast.success("Task status updated!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "categories"],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  const requestTaskUpdate = useCallback(
    async (
      taskId: string,
      updateDescription: string,
      newStatus: TaskStatus
    ) => {
      await taskAPI.requestTaskUpdate(projectId as string, taskId, {
        updateDescription,
        newStatus,
      });
      toast.success("Update request submitted!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "categories"],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  const acceptPendingUpdate = useCallback(
    async (pendingUpdateId: string, newStatus: TaskStatus) => {
      await taskAPI.acceptPendingUpdate(projectId as string, pendingUpdateId, {
        newStatus,
      });
      toast.success("Update approved!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "categories"],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  const rejectPendingUpdate = useCallback(
    async (pendingUpdateId: string) => {
      await taskAPI.rejectPendingUpdate(projectId as string, pendingUpdateId);
      toast.success("Update rejected!");
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId, "categories"],
      });
      refetch();
    },
    [projectId, refetch, queryClient]
  );

  return {
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    requestTaskUpdate,
    acceptPendingUpdate,
    rejectPendingUpdate,
  };
};
