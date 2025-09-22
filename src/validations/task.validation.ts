import joi from "joi";
import type { GetTasksParams, RemoveTaskBody, UpdateTaskStatusBody, AddTaskBody } from "../dtos/task.dto.js";

const addTaskSchema = {
  body: joi.object<AddTaskBody>({
    userId: joi.string().uuid(),
    description: joi.string().min(1).max(255),
  }),
};

const removeTaskSchema = {
  body: joi.object<RemoveTaskBody>({
    userId: joi.string().uuid(),
    taskId: joi.string().uuid(),
  }).unknown(),
};

const updateTaskStatusSchema = {
  body: joi.object<UpdateTaskStatusBody>({
    userId: joi.string().uuid(),
    taskId: joi.string().uuid(),
    status: joi.string().valid("active", "complete", "canceled"),
  }),
};

const getTaskSchema = {
  params: joi.object<GetTasksParams>({
    userId: joi.string().uuid(),
  }),
};

const taskSchemas = {
  addTaskSchema,
  getTaskSchema,
  removeTaskSchema,
  updateTaskStatusSchema,
};

export default taskSchemas;