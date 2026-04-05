import { registry } from "../registry.js";
import {
  CreateTaskRequestSchema,
  UpdateTaskRequestSchema,
  RequestTaskUpdateRequestSchema,
  TaskResponseSchema,
  TaskUpdateRequestResponseSchema,
  ApiErrorResponseSchema,
} from "../../schemas/index.js";

registry.registerPath({
  method: "post",
  path: "/api/task/{projectId}/{phaseId}",
  tags: ["Tasks"],
  summary: "Create a new task",
  description: "Create a task in a specific phase",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateTaskRequestSchema.body,
        },
      },
    },
    params: CreateTaskRequestSchema.params,
  },
  responses: {
    201: {
      description: "Task created successfully",
      content: {
        "application/json": {
          schema: TaskResponseSchema,
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
  path: "/api/task/{projectId}/{taskId}",
  tags: ["Tasks"],
  summary: "Update a task",
  description: "Update task details",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateTaskRequestSchema.body,
        },
      },
    },
    params: UpdateTaskRequestSchema.params,
  },
  responses: {
    200: {
      description: "Task updated successfully",
      content: {
        "application/json": {
          schema: TaskResponseSchema,
        },
      },
    },
    404: {
      description: "Task not found",
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
  path: "/api/task/{projectId}/{taskId}",
  tags: ["Tasks"],
  summary: "Delete a task",
  description: "Remove a task from the project",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Task deleted successfully",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
    404: {
      description: "Task not found",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/task/request-update/{projectId}/{taskId}",
  tags: ["Tasks"],
  summary: "Request task update",
  description: "Request an update for a task",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: RequestTaskUpdateRequestSchema.body,
        },
      },
    },
    params: RequestTaskUpdateRequestSchema.params,
  },
  responses: {
    201: {
      description: "Update request created",
      content: {
        "application/json": {
          schema: TaskUpdateRequestResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/task/accept-update/{projectId}/{pendingUpdateId}",
  tags: ["Tasks"],
  summary: "Accept a pending update",
  description: "Accept a task update request",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Update accepted",
      content: {
        "application/json": {
          schema: TaskUpdateRequestResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/task/reject-update/{projectId}/{pendingUpdateId}",
  tags: ["Tasks"],
  summary: "Reject a pending update",
  description: "Reject a task update request",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Update rejected",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
  },
});
