export interface CreateProjectDTO {
  title: string;
  description: string;
}

export interface UpdateProjectDTO {
  title?: string;
  description?: string;
}

export interface AddMemberDTO {
  userId?: string;
  email?: string;
  access?: string;
}

export interface RespondInvitationDTO {
  action: "accept" | "decline";
}
