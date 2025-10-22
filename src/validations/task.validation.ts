import joi from "joi";
import type { GetTasksParams, RemoveTaskBody, UpdateTaskSchema, AddTaskBody } from "../dtos/task.dto.ts";

const addTaskSchema = {
  body: joi.object<AddTaskBody>({
    description: joi.string().min(1).max(255).required(),
  }).unknown(),
};

const removeTaskSchema = {
  body: joi.object<RemoveTaskBody>({
    taskId: joi.string().uuid().required(),
  }).unknown(),
};

const updateTaskSchema = {
  body: joi.object<UpdateTaskSchema>({
    taskId: joi.string().uuid().required(),
    status: joi.string().valid("active", "complete", "canceled").required(),
    description: joi.string().min(1).required(),
  }).unknown(),
};

const getTaskSchema = {
  params: joi.object<GetTasksParams>({
    userId: joi.string().uuid().required(),
  }).unknown(),
};

const taskSchemas = {
  addTaskSchema,
  getTaskSchema,
  removeTaskSchema,
  updateTaskStatusSchema: updateTaskSchema,
};

export default taskSchemas;