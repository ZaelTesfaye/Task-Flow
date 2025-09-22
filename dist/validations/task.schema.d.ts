import joi from "joi";
import type { GetTasksParams, RemoveTaskBody, UpdateTaskStatusBody, AddTaskBody } from "../src/dtos/task.dto.ts";
declare const taskSchemas: {
    addTaskSchema: {
        body: joi.ObjectSchema<AddTaskBody>;
    };
    getTaskSchema: {
        params: joi.ObjectSchema<GetTasksParams>;
    };
    removeTaskSchema: {
        body: joi.ObjectSchema<RemoveTaskBody>;
    };
    updateTaskStatus: {
        body: joi.ObjectSchema<UpdateTaskStatusBody>;
    };
};
export default taskSchemas;
//# sourceMappingURL=task.schema.d.ts.map