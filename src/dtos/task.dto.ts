export interface AddTaskBody {
    userId: string;
    description: string;
}

export interface UpdateTaskStatusBody {
    userId: string;
    taskId: string;
    status: "complete" | "Complete" | "canceled";
}

export interface RemoveTaskBody {
    userId: string;
    taskId: string;
}

export interface GetTasksParams {
    userId: string;
}