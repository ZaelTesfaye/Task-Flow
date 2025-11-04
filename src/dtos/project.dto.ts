export interface CreateProjectDTO {
  title: string;
  description: string;
}

export interface UpdateProjectDTO {
  title?: string;
  description?: string;
}

export interface AddMemberDTO {
  userId: string;
  access?: string;
}
