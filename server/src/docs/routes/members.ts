import { registry } from "../registry.js";
import {
  ProjectSchema,
  UserSchema,
  AddMemberRequestSchema,
  UpdateMemberRequestSchema,
  ProjectMembersResponseSchema,
  InvitationsListResponseSchema,
  ApiErrorResponseSchema,
} from "../../schemas/index.js";

registry.registerPath({
  method: "post",
  path: "/api/project/member/{projectId}",
  tags: ["Project Members"],
  summary: "Add project member",
  description: "Add a new member to the project",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: AddMemberRequestSchema.body,
        },
      },
    },
    params: AddMemberRequestSchema.params,
  },
  responses: {
    201: {
      description: "Member added successfully",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/project/member/{projectId}",
  tags: ["Project Members"],
  summary: "Get project members",
  description: "Get all members of a project",
  security: [{ bearerAuth: [] }],
  request: {
    params: ProjectSchema.pick({ id: true }).extend({
      projectId: ProjectSchema.shape.id,
    }),
  },
  responses: {
    200: {
      description: "List of project members",
      content: {
        "application/json": {
          schema: ProjectMembersResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/project/member/{projectId}/invitations",
  tags: ["Project Members"],
  summary: "Get project invitations",
  description: "Get pending invitations for a project",
  security: [{ bearerAuth: [] }],
  request: {
    params: ProjectSchema.pick({ id: true }).extend({
      projectId: ProjectSchema.shape.id,
    }),
  },
  responses: {
    200: {
      description: "List of pending invitations",
      content: {
        "application/json": {
          schema: InvitationsListResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/project/member/{projectId}/{userId}",
  tags: ["Project Members"],
  summary: "Update project member",
  description: "Promote or update member role",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateMemberRequestSchema.body,
        },
      },
    },
    params: UpdateMemberRequestSchema.params,
  },
  responses: {
    200: {
      description: "Member updated successfully",
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
  path: "/api/project/member/{projectId}/{userId}",
  tags: ["Project Members"],
  summary: "Remove project member",
  description: "Remove a member from the project",
  security: [{ bearerAuth: [] }],
  request: {
    params: ProjectSchema.pick({ id: true }).extend({
      projectId: ProjectSchema.shape.id,
      userId: UserSchema.shape.id,
    }),
  },
  responses: {
    200: {
      description: "Member removed successfully",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
  },
});
