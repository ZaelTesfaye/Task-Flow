import { projectModel } from "../model/index.js";
import userModel from "../model/user.model.js";
import { APIError } from "../utils/error.js";

export const createProject = (
  title: string,
  description: string,
  userId: string,
) => {
  return projectModel.createProject(title, description, userId);
};

export const updateProject = (
  projectId: string,
  updates: { title?: string; description?: string },
) => {
  return projectModel.updateProject(projectId, updates);
};

export const removeProject = (id: string) => {
  return projectModel.removeProject(id);
};

export const addMember = async (
  projectId: string,
  userId: string,
  email: string,
  access: string = "member",
) => {
  if (userId) {
    return projectModel.addMember(projectId, userId, email, access);
  } else {
    const user = await userModel.findByEmail(email);
    if (!user) throw new APIError("User not found", 404);

    return projectModel.addMember(projectId, user.id, access);
  }
};

export const removeMember = (projectId: string, userId: string) => {
  return projectModel.removeMember(projectId, userId);
};

export const checkUserAccess = async (
  projectId: string,
  userId: string,
  requiredAccess: string[],
) => {
  const result = await projectModel.checkUserAccess(
    projectId,
    userId,
    requiredAccess,
  );
  return !!result;
};

export const promoteProjectMember = (
  projectId: string,
  userId: string,
  access: string,
) => {
  return projectModel.promoteMember(projectId, userId, access);
};

export const getUserProjects = async (userId: string) => {
  const memberships = await projectModel.getUserProjects(userId);

  // Categorize projects by access level
  const categorized = {
    owner: [] as any[],
    admin: [] as any[],
    member: [] as any[],
  };

  for (const membership of memberships) {
    const project = membership.project;
    switch (membership.access) {
      case "owner":
        categorized.owner.push(project);
        break;
      case "admin":
        categorized.admin.push(project);
        break;
      case "member":
        categorized.member.push(project);
        break;
    }
  }

  return categorized;
};

export const getProjectMembers = (projectId: string) => {
  return projectModel.getProjectMembers(projectId);
};

export const getProjectById = (projectId: string) => {
  return projectModel.getProjectById(projectId);
};
