import { z } from "../lib/zod-openapi.js";
import { TaskSchema } from "./task.schema.js";
import { UserSchema } from "./user.schema.js";
import { ApiSuccessResponseSchema } from "./api.schema.js";

export const PhaseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    projectId: z.string().uuid(),
    order: z.number().optional(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
    tasks: z.array(TaskSchema).optional(),
  })
  .openapi("Phase");

// Request Validation Schemas

export const CreatePhaseRequestSchema = {
  body: z
    .object({
      name: z.string().min(1).max(100),
    })
    .openapi("CreatePhaseBody"),
  params: z.object({
    projectId: z.string().uuid(),
  }),
};

export const UpdatePhaseRequestSchema = {
  body: z
    .object({
      name: z.string().min(1).max(100).optional(),
      order: z.number().optional(),
    })
    .openapi("UpdatePhaseBody"),
  params: z.object({
    projectId: z.string().uuid(),
    phaseId: z.string().uuid(),
  }),
};

export const RemovePhaseRequestSchema = {
  params: z.object({
    projectId: z.string().uuid(),
    phaseId: z.string().uuid(),
  }),
};

// Response Schemas

export const PhaseResponseSchema = ApiSuccessResponseSchema(PhaseSchema).openapi("PhaseResponse");

export const PhasesListResponseSchema = ApiSuccessResponseSchema(
  z.object({
    project: z.object({
      id: z.string().uuid(),
      title: z.string(),
      description: z.string().nullable(),
      owner: UserSchema,
    }),
    phases: z.array(PhaseSchema),
  }),
).openapi("PhasesListResponse");

export const PhaseDeleteResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi("PhaseDeleteResponse");
