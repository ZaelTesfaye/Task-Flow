"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = require("joi");
var addTaskSchema = {
    body: joi_1.default.object({
        userId: joi_1.default.string().uuid(),
        description: joi_1.default.string,
    }),
};
var removeTaskSchema = {
    body: joi_1.default.object({
        userId: joi_1.default.string().uuid(),
        taskId: joi_1.default.string().uuid(),
    }),
};
var updateTaskStatusSchema = {
    body: joi_1.default.object({
        userId: joi_1.default.string().uuid(),
        taskId: joi_1.default.string().uuid(),
        status: joi_1.default.string().valid("active", "complete", "canceled"),
    }),
};
var getTaskSchema = {
    body: joi_1.default.object({
        userId: joi_1.default.string().uuid(),
    }),
};
var taskSchemas = {
    addTaskSchema: addTaskSchema,
    getTaskSchema: getTaskSchema,
    removeTaskSchema: removeTaskSchema,
    updateTaskStatus: updateTaskStatusSchema,
};
exports.default = taskSchemas;
