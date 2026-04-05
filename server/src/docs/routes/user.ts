import { registry } from "../registry.js";
import {
  UpdateUserRequestSchema,
  UpdateUserResponseSchema,
  GetMeResponseSchema,
  DeleteUserResponseSchema,
  ApiErrorResponseSchema,
} from "../../schemas/index.js";

registry.registerPath({
  method: "get",
  path: "/api/user/me",
  tags: ["User"],
  summary: "Get current user",
  description: "Get profile of authenticated user",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "User profile",
      content: {
        "application/json": {
          schema: GetMeResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
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
  path: "/api/user",
  tags: ["User"],
  summary: "Update user profile",
  description: "Update current user's profile information",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateUserRequestSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Profile updated successfully",
      content: {
        "application/json": {
          schema: UpdateUserResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/user",
  tags: ["User"],
  summary: "Delete user account",
  description: "Permanently delete user account",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Account deleted successfully",
      content: {
        "application/json": {
          schema: DeleteUserResponseSchema,
        },
      },
    },
  },
});
