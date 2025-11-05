import { projectModel } from "../model/index.js";

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

export const addMember = (
  projectId: string,
  userId: string,
  access: string = "member",
) => {
  return projectModel.addMember(projectId, userId, access);
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
