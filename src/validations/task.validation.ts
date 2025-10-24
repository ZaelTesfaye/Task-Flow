import joi from "joi";
import type { GetTasksParams, RemoveTaskBody, UpdateTaskSchema, AddTaskBody } from "../dtos/task.dto.js";

const addTaskSchema = {
  body: joi.object<AddTaskBody>({
    description: joi.string().min(1).max(255).required(),
  })
  .required().unknown(true),
};

const removeTaskSchema = {
  body: joi.object<RemoveTaskBody>({
    taskId: joi.string().uuid().required(),
  })
  .required().unknown(true),
};

const updateTaskSchema = {
  body: joi.object<UpdateTaskSchema>({
    taskId: joi.string().uuid().required(),
    status: joi.string().valid("active", "complete", "canceled").required(),
    description: joi.string().min(1).required(),
  })
  .required().unknown(true),
};

const getTaskSchema = {
  params: joi.object<GetTasksParams>({
    userId: joi.string().uuid().required(),
  })
  .required().unknown(true),
};

const taskSchemas = {
  addTaskSchema,
  getTaskSchema,
  removeTaskSchema,
  updateTaskStatusSchema: updateTaskSchema,
};

export default taskSchemas;