import { z } from "../lib/zod-openapi.js";
import { UserSchema } from "./user.schema.js";
import { ApiSuccessResponseSchema } from "./api.schema.js";

export const ProjectSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    ownerId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
  })
  .openapi("Project");

export const ProjectMemberSchema = z
  .object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    userId: z.string().uuid(),
    access: z.string(),
    joinedAt: z.date(),
    user: UserSchema.optional(),
  })
  .openapi("ProjectMember");

export const InvitationProjectSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    ownerId: z.string().uuid().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .openapi("InvitationProject");

export const InvitationSchema = z
  .object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    inviterId: z.string().uuid(),
    inviteeId: z.string().uuid().nullable().optional(),
    email: z.string().email().nullable().optional(),
    access: z.string(),
    status: z.string(),
    createdAt: z.date(),
    respondedAt: z.date().nullable().optional(),
    project: InvitationProjectSchema.optional(),
    inviter: UserSchema.optional(),
    invitee: UserSchema.nullable().optional(),
  })
  .openapi("Invitation");

// Request Validation Schema
export const CreateProjectRequestSchema = {
  body: z
    .object({
      title: z.string().min(1).max(100),
      description: z.string().min(1).max(255),
    })
    .openapi("CreateProjectBody"),
};

export const UpdateProjectRequestSchema = {
  body: z
    .object({
      title: z.string().min(1).max(100).optional(),
      description: z.string().min(1).max(255).optional(),
    })
    .openapi("UpdateProjectBody"),
  params: z.object({
    projectId: z.string().uuid(),
  }),
};

export const RemoveProjectRequestSchema = {
  params: z.object({
    projectId: z.string().uuid(),
  }),
};

export const AddMemberRequestSchema = {
  body: z
    .object({
      userId: z.string().uuid().optional(),
      email: z.string().email().optional(),
      access: z.enum(["admin", "member"]).optional(),
    })
    .openapi("AddMemberBody"),
  params: z.object({
    projectId: z.string().uuid(),
  }),
};

export const UpdateMemberRequestSchema = {
  body: z
    .object({
      access: z.enum(["admin", "member"]),
    })
    .openapi("UpdateMemberBody"),
  params: z.object({
    projectId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
};

export const RemoveMemberRequestSchema = {
  params: z.object({
    projectId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
};

export const GetProjectMembersRequestSchema = {
  params: z.object({
    projectId: z.string().uuid(),
  }),
};

export const GetProjectInvitationsRequestSchema = {
  params: z.object({
    projectId: z.string().uuid(),
  }),
};

export const RespondInvitationRequestSchema = {
  body: z
    .object({
      action: z.enum(["accept", "decline"]),
    })
    .openapi("RespondInvitationBody"),
  params: z.object({
    invitationId: z.string().uuid(),
  }),
};

// Response Schemas

export const ProjectResponseSchema = ApiSuccessResponseSchema(ProjectSchema).openapi("ProjectResponse");

export const ProjectsListResponseSchema = ApiSuccessResponseSchema(
  z.object({
    owner: z.array(ProjectSchema),
    admin: z.array(ProjectSchema),
    member: z.array(ProjectSchema),
  }),
).openapi("ProjectsListResponse");

export const ProjectMembersResponseSchema = ApiSuccessResponseSchema(z.array(ProjectMemberSchema)).openapi(
  "ProjectMembersResponse",
);

export const InvitationsListResponseSchema = ApiSuccessResponseSchema(z.array(InvitationSchema)).openapi(
  "InvitationsListResponse",
);

export const ProjectDeleteResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi("ProjectDeleteResponse");

export const MemberResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi("MemberResponse");

export const InvitationResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi("InvitationResponse");
