import { registry } from "../registry.js";
import {
  CreatePhaseRequestSchema,
  UpdatePhaseRequestSchema,
  PhaseResponseSchema,
  PhasesListResponseSchema,
  ApiErrorResponseSchema,
} from "../../schemas/index.js";

registry.registerPath({
  method: "get",
  path: "/api/phase/{projectId}",
  tags: ["Phases"],
  summary: "Get project phases",
  description: "Get all phases for a project",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "List of phases with tasks",
      content: {
        "application/json": {
          schema: PhasesListResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/phase/{projectId}",
  tags: ["Phases"],
  summary: "Create a new phase",
  description: "Create a phase in a project",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreatePhaseRequestSchema.body,
        },
      },
    },
    params: CreatePhaseRequestSchema.params,
  },
  responses: {
    201: {
      description: "Phase created successfully",
      content: {
        "application/json": {
          schema: PhaseResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/phase/{projectId}/{phaseId}",
  tags: ["Phases"],
  summary: "Update a phase",
  description: "Update phase details",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdatePhaseRequestSchema.body,
        },
      },
    },
    params: UpdatePhaseRequestSchema.params,
  },
  responses: {
    200: {
      description: "Phase updated successfully",
      content: {
        "application/json": {
          schema: PhaseResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/phase/{projectId}/{phaseId}",
  tags: ["Phases"],
  summary: "Delete a phase",
  description: "Remove a phase from the project",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Phase deleted successfully",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
  },
});
