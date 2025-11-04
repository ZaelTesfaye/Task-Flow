import * as projectModel from "../model/project.model.js";

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
