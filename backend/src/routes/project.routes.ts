import express from "express";
import { projectController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";
import {
  createProjectSchema,
  updateProjectSchema,
  removeProjectSchema,
  addMemberSchema,
  updateMemberSchema,
  removeMemberSchema,
  getProjectMembersSchema,
} from "../validations/index.js";

const router = express.Router();

// create project
router.post(
  "/",
  validatorMiddleware(createProjectSchema),
  projectController.createProject,
);

// update project
router.patch(
  "/:projectId",
  validatorMiddleware(updateProjectSchema),
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
  validatorMiddleware(removeProjectSchema),
  projectController.removeProject,
);

// create project member
router.post(
  "/member/:projectId",
  validatorMiddleware(addMemberSchema),
  projectController.addMember,
);

// update project member
router.patch(
  "/member/:projectId/:userId",
  validatorMiddleware(updateMemberSchema),
  projectController.promoteProjectMember,
);

// Get all project members
router.get(
  "/member/:projectId",
  validatorMiddleware(getProjectMembersSchema),
  projectController.getProjectMembers,
);

// remove project members
router.delete(
  "/member/:projectId/:userId",
  validatorMiddleware(removeMemberSchema),
  projectController.removeProjectMember,
);

export default router;
