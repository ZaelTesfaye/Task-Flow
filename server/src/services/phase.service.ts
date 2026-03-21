import { phaseModel } from "../model/index.js";

export const createPhase = (name: string, projectId: string) => {
  return phaseModel.createPhase(name, projectId);
};

export const updatePhase = (
  phaseId: string,
  updates: { name?: string },
) => {
  return phaseModel.updatePhase(phaseId, updates);
};

export const getPhases = (projectId: string) => {
  return phaseModel.getPhases(projectId);
};

export const getPhase = (phaseId: string, projectId: string) => {
  return phaseModel.getPhase(phaseId, projectId);
};

export const removePhase = (phaseId: string, projectId: string) => {
  return phaseModel.removePhase(phaseId, projectId);
};

/**
 * Get project with all phases and tasks in a single query
 * Reduces database roundtrips vs separate getPhases + getProjectById calls
 */
export const getProjectWithPhases = (projectId: string) => {
  return phaseModel.getProjectWithPhases(projectId);
};
