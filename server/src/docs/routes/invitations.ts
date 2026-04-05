import { registry } from "../registry.js";
import {
  RespondInvitationRequestSchema,
  InvitationsListResponseSchema,
  ApiErrorResponseSchema,
} from "../../schemas/index.js";

registry.registerPath({
  method: "get",
  path: "/api/project/invitations",
  tags: ["Invitations"],
  summary: "Get user invitations",
  description: "Get all pending invitations for the authenticated user",
  security: [{ bearerAuth: [] }],
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
  path: "/api/project/invitations/{invitationId}",
  tags: ["Invitations"],
  summary: "Respond to invitation",
  description: "Accept or decline a project invitation",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: RespondInvitationRequestSchema.body,
        },
      },
    },
    params: RespondInvitationRequestSchema.params,
  },
  responses: {
    200: {
      description: "Invitation response recorded",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
    404: {
      description: "Invitation not found",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
  },
});
