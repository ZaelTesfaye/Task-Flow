import prisma from "../lib/prisma.js";

export const createPhase = (name: string, projectId: string) => {
  return prisma.phase.create({
    data: {
      name,
      projectId,
    },
  });
};

export const updatePhase = (
  phaseId: string,
  updates: { name?: string },
) => {
  return prisma.phase.update({
    where: {
      id: phaseId,
    },
    data: updates,
  });
};

export const getPhases = (projectId: string) => {
  return prisma.phase.findMany({
    where: {
      projectId,
    },
    include: {
      tasks: {
        include: {
          pendingUpdates: true,
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

/**
 * Get project and phases in a single query to avoid N+1 pattern
 * This reduces database roundtrips significantly
 */
export const getProjectWithPhases = (projectId: string) => {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      phases: {
        include: {
          tasks: {
            include: {
              pendingUpdates: true,
              assignedUser: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const getPhase = (phaseId: string, projectId: string) => {
  return prisma.phase.findUnique({
    where: {
      id: phaseId,
      projectId,
    },
  });
};

export const removePhase = (phaseId: string, projectId: string) => {
  return prisma.phase.delete({
    where: {
      id: phaseId,
      projectId,
    },
  });
};
