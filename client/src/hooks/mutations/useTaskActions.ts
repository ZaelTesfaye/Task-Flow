import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { taskApi } from "@/lib";
import type { TaskStatus } from "@/types";

export const useTaskMutations = (projectId: string) => {
  const queryClient = useQueryClient();

  const createTask = async (phaseId: string, data: { title: string; description: string; assignedTo: string }) => {
    await taskApi.post(data, `${projectId}/${phaseId}`);
    toast.success("Task created!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
    await queryClient.invalidateQueries({
      queryKey: ["project-notifications", projectId],
    });
  };

  const updateTask = async (taskId: string, data: { title: string; description: string }) => {
    await taskApi.patch(data, `${projectId}/${taskId}`);
    toast.success("Task updated!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

  const deleteTask = async (taskId: string) => {
    await taskApi.delete(`${projectId}/${taskId}`);
    toast.success("Task deleted!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    await taskApi.patch({ status }, `${projectId}/${taskId}`);
    toast.success("Task status updated!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

  const requestTaskUpdate = async (taskId: string, updateDescription: string, newStatus: TaskStatus) => {
    await taskApi.post({ updateDescription, newStatus }, `request-update/${projectId}/${taskId}`);
    toast.success("Update request submitted!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

  const acceptPendingUpdate = async (pendingUpdateId: string, newStatus: TaskStatus) => {
    await taskApi.patch({ newStatus }, `accept-update/${projectId}/${pendingUpdateId}`);
    toast.success("Update approved!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

  const rejectPendingUpdate = async (pendingUpdateId: string) => {
    await taskApi.patch(undefined, `reject-update/${projectId}/${pendingUpdateId}`);
    toast.success("Update rejected!");
    await queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });
  };

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
