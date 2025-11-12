import { User } from "./user.type";

export type MemberFilter = "all" | "owner" | "admin" | "member";

export type InvitationStatus = "pending" | "accepted" | "declined" | "expired";

export interface Project {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
}

export interface UserProjectsResponse {
  owner: Project[];
  admin: Project[];
  member: Project[];
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  access: "owner" | "admin" | "member";
  user: User;
}

export interface AddMemberRequest {
  email: string;
  access?: "admin" | "member";
}

export interface UpdateMemberRequest {
  access: "admin" | "member";
}

export interface ProjectInvitation {
  id: string;
  email: string;
  status: "pending" | "accepted" | "declined" | "expired";
  access: "admin" | "member";
  createdAt: string;
  respondedAt?: string | null;
  projectId: string;
  inviter: User;
  invitee?: User | null;
  project?: Project;
}

export interface RespondInvitationRequest {
  action: "accept" | "decline";
}
