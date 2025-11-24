import { categoryModel } from "../model/index.js";

export const createCategory = (name: string, projectId: string) => {
  return categoryModel.createCategory(name, projectId);
};

export const updateCategory = (
  categoryId: string,
  updates: { name?: string },
) => {
  return categoryModel.updateCategory(categoryId, updates);
};

export const getCategories = (projectId: string) => {
  return categoryModel.getCategories(projectId);
};
export const getCategory = (categoryId: string, projectId: string) => {
  return categoryModel.getCategory(categoryId, projectId);
};

export const removeCategory = (categoryId: string, projectId: string) => {
  return categoryModel.removeCategory(categoryId, projectId);
};
