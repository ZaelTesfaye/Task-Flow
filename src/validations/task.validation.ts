import joi from "joi";
import type {
  CreateTaskDTO,
  UpdateTaskDTO as UpdateTaskDTO,
  RequestTaskUpdateDTO,
} from "../dtos/task.dto.js";

export const createTaskSchema = {
  body: joi
    .object<CreateTaskDTO>({
      title: joi.string().min(1).max(60).required(),
      description: joi.string().min(1).max(255).required(),
      assignedTo: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),

  params: joi
    .object({
      projectId: joi.string().uuid().required(),
      categoryId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),
};

export const updateTaskSchema = {
  body: joi
    .object<UpdateTaskDTO>({
      title: joi.string().min(1).max(60).optional(),
      description: joi.string().min(1).max(255).optional(),
      status: joi.string().valid("active", "complete", "canceled").optional(),
      categoryId: joi.string().uuid().optional(),
    })
    .or("description", "status")
    .unknown(true),
  params: joi
    .object({
      projectId: joi.string().uuid().required(),
      taskId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),
};

export const removeTaskSchema = {
  params: joi
    .object({
      projectId: joi.string().uuid().required(),
      taskId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),
};

export const getTasksSchema = {
  params: joi
    .object({
      projectId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),
};

export const requestTaskUpdateSchema = {
  body: joi
    .object<RequestTaskUpdateDTO>({
      updateDescription: joi.string().min(1).max(255).required(),
      newStatus: joi
        .string()
        .valid("active", "complete", "canceled")
        .required(),
    })
    .required()
    .unknown(true),
  params: joi
    .object({
      projectId: joi.string().uuid().required(),
      taskId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),
};

export const acceptPendingUpdateSchema = {
  params: joi
    .object({
      projectId: joi.string().uuid().required(),
      pendingUpdateId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),
};
