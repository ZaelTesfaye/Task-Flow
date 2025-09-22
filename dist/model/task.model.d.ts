declare const taskModel: {
    addTask: (userId: string, description: string) => Promise<{
        id: string;
        description: string;
        status: string;
        userId: string;
    }>;
    removeTask: (userId: string, taskId: string) => Promise<{
        id: string;
        description: string;
        status: string;
        userId: string;
    }>;
    updateTaskStatus: (userId: string, taskId: string, status: string) => Promise<{
        id: string;
        description: string;
        status: string;
        userId: string;
    }>;
    getTasks: (userId: string) => Promise<{
        id: string;
        description: string;
        status: string;
        userId: string;
    }[]>;
};
export default taskModel;
//# sourceMappingURL=task.model.d.ts.map