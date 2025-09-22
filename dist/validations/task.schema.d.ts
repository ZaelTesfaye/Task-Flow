import joi from "joi";
declare const taskSchemas: {
    addTaskSchema: {
        body: joi.ObjectSchema<any>;
    };
    getTaskSchema: {
        body: joi.ObjectSchema<any>;
    };
    removeTaskSchema: {
        body: joi.ObjectSchema<any>;
    };
    updateTaskStatus: {
        body: joi.ObjectSchema<any>;
    };
};
export default taskSchemas;
//# sourceMappingURL=task.schema.d.ts.map