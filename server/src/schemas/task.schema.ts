import { z } from "../lib/zod-openapi.js";
import { ApiSuccessResponseSchema } from "./api.schema.js";

export const TaskSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    status: z.string(),
    phaseId: z.string().uuid(),
    projectId: z.string().uuid().optional(),
    creatorId: z.string().uuid().optional(),
    assignedTo: z.string().uuid(),
    assignedBy: z.string().uuid().optional(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
  })
  .openapi("Task");

// Request Validation Schemas
export const CreateTaskRequestSchema = {
  body: z
    .object({
      title: z.string().min(1).max(60),
      description: z.string().min(1).max(255),
      assignedTo: z.string().min(1),
    })
    .openapi("CreateTaskBody"),
  params: z.object({
    projectId: z.string().uuid(),
    phaseId: z.string().uuid(),
  }),
};

export const UpdateTaskRequestSchema = {
  body: z
    .object({
      title: z.string().min(1).max(60).optional(),
      description: z.string().min(1).max(255).optional(),
      status: z.enum(["active", "complete", "canceled"]).optional(),
      phaseId: z.string().uuid().optional(),
    })
    .openapi("UpdateTaskBody"),
  params: z.object({
    projectId: z.string().uuid(),
    taskId: z.string().uuid(),
  }),
};

export const RemoveTaskRequestSchema = {
  params: z.object({
    projectId: z.string().uuid(),
    taskId: z.string().uuid(),
  }),
};

export const RequestTaskUpdateRequestSchema = {
  body: z
    .object({
      updateDescription: z.string().min(1).max(255),
      newStatus: z.enum(["active", "complete", "canceled"]),
    })
    .openapi("RequestTaskUpdateBody"),
  params: z.object({
    projectId: z.string().uuid(),
    taskId: z.string().uuid(),
  }),
};

export const AcceptPendingUpdateRequestSchema = {
  params: z.object({
    projectId: z.string().uuid(),
    pendingUpdateId: z.string().uuid(),
  }),
};

export const TaskUpdateRequestSchema = z
  .object({
    id: z.string().uuid(),
    taskId: z.string().uuid(),
    requesterId: z.string().uuid().optional(),
    updateBy: z.string().uuid().optional(),
    updateDescription: z.string(),
    newStatus: z.string(),
    status: z.string().optional(),
    createdAt: z.date(),
    createdAtDate: z.date().optional(),
  })
  .openapi("TaskUpdateRequest");

// Response Schemas

export const TaskResponseSchema = ApiSuccessResponseSchema(TaskSchema).openapi("TaskResponse");

export const TaskUpdateRequestResponseSchema =
  ApiSuccessResponseSchema(TaskUpdateRequestSchema).openapi("TaskUpdateRequestResponse");

export const TaskDeleteResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi("TaskDeleteResponse");
