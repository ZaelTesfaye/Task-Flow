import { useCallback } from "react";
import { taskAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { TaskStatus } from "@/types/index";

export const useTaskActions = (
  projectId: string | string[] | undefined,
  refetch: () => void
) => {
  const createTask = useCallback(
    async (
      categoryId: string,
      data: { title: string; description: string; assignedTo: string }
    ) => {
      await taskAPI.createTask(projectId as string, categoryId, data);
      toast.success("Task created!");
      refetch();
    },
    [projectId, refetch]
  );

  const updateTask = useCallback(
    async (taskId: string, data: { title: string; description: string }) => {
      await taskAPI.updateTask(projectId as string, taskId, data);
      toast.success("Task updated!");
      refetch();
    },
    [projectId, refetch]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      await taskAPI.removeTask(projectId as string, taskId);
      toast.success("Task deleted!");
      refetch();
    },
    [projectId, refetch]
  );

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      await taskAPI.updateTask(projectId as string, taskId, { status });
      toast.success("Task status updated!");
      refetch();
    },
    [projectId, refetch]
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
      refetch();
    },
    [projectId, refetch]
  );

  const acceptPendingUpdate = useCallback(
    async (pendingUpdateId: string, newStatus: TaskStatus) => {
      await taskAPI.acceptPendingUpdate(projectId as string, pendingUpdateId, {
        newStatus,
      });
      toast.success("Update approved!");
      refetch();
    },
    [projectId, refetch]
  );

  const rejectPendingUpdate = useCallback(
    async (pendingUpdateId: string) => {
      await taskAPI.rejectPendingUpdate(projectId as string, pendingUpdateId);
      toast.success("Update rejected!");
      refetch();
    },
    [projectId, refetch]
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
