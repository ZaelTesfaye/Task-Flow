export interface AddTaskBody {
    userId: string;
    description: string;
}
export interface UpdateTaskStatusBody {
    userId: string;
    taskId: string;
    status: string;
}
export interface RemoveTaskBody {
    userId: string;
    taskId: string;
}
export interface GetTasksParams {
    userId: string;
}
//# sourceMappingURL=task.dto.d.ts.map