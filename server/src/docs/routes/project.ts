import { registry } from "../registry.js";
import {
  ProjectSchema,
  CreateProjectRequestSchema,
  UpdateProjectRequestSchema,
  ProjectResponseSchema,
  ProjectsListResponseSchema,
  ApiErrorResponseSchema,
} from "../../schemas/index.js";

registry.registerPath({
  method: "get",
  path: "/api/project",
  tags: ["Projects"],
  summary: "Get all user projects",
  description: "Retrieve all projects for the authenticated user",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "List of projects",
      content: {
        "application/json": {
          schema: ProjectsListResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/project",
  tags: ["Projects"],
  summary: "Create a new project",
  description: "Create a new project for the authenticated user",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateProjectRequestSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Project created successfully",
      content: {
        "application/json": {
          schema: ProjectResponseSchema,
        },
      },
    },
    400: {
      description: "Invalid input",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/project/{projectId}",
  tags: ["Projects"],
  summary: "Update a project",
  description: "Update project details",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateProjectRequestSchema.body,
        },
      },
    },
    params: UpdateProjectRequestSchema.params,
  },
  responses: {
    200: {
      description: "Project updated successfully",
      content: {
        "application/json": {
          schema: ProjectResponseSchema,
        },
      },
    },
    404: {
      description: "Project not found",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/project/{projectId}",
  tags: ["Projects"],
  summary: "Delete a project",
  description: "Remove a project",
  security: [{ bearerAuth: [] }],
  request: {
    params: ProjectSchema.pick({ id: true }).extend({
      projectId: ProjectSchema.shape.id,
    }),
  },
  responses: {
    200: {
      description: "Project deleted successfully",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
    404: {
      description: "Project not found",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
  },
});
