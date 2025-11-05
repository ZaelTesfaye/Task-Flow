import express from "express";
import * as projectController from "../controllers/project.controller.js";
import * as projectSchema from "../validations/project.valdiation.js";
import { validatorMiddleware } from "../middlewares/index.js";

const router = express.Router();

// create project
router.post(
  "/",
  validatorMiddleware(projectSchema.createProjectSchema),
  projectController.createProject,
);

// update project
router.patch(
  "/:projectId",
  validatorMiddleware(projectSchema.updateProjectSchema),
  projectController.updateProject,
);

// Get all projects for a user
router.get(
  "/",
  // no request content
  projectController.getUserProjects,
);

// remove project
router.delete(
  "/:projectId",
  validatorMiddleware(projectSchema.removeProjectSchema),
  projectController.removeProject,
);

// create project member
router.post(
  "/member/:projectId",
  validatorMiddleware(projectSchema.addMemberSchema),
  projectController.addMember,
);

// update project member
router.patch(
  "/member/:projectId/:userId",
  validatorMiddleware(projectSchema.promoteMemberSchema),
  projectController.promoteProjectMember,
);

// Get all project members
router.get(
  "/member/:projectId",
  validatorMiddleware(projectSchema.getProjectMembersSchema),
  projectController.getProjectMembers,
);

// remove project members
router.delete(
  "/member/:projectId/:userId",
  validatorMiddleware(projectSchema.removeMemberSchema),
  projectController.removeProjectMember,
);

export default router;
