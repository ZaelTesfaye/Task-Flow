export interface AddTaskBody {
  description: string;
}

export interface UpdateTaskSchema {
  taskId: string;
  status: "complete" | "Complete" | "canceled";
  description: string;
}

export interface RemoveTaskBody {
  taskId: string;
}

export interface GetTasksParams {
  userId: string;
}
