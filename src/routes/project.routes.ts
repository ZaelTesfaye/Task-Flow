import express from "express";
import * as projectController from "../controllers/project.controller.js";
import * as projectSchema from "../../views/project.valdiation.js";
import { validatorMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.post(
  "/create-project",
  validatorMiddleware(projectSchema.createProjectSchema),
  projectController.createProject,
);

router.patch(
  "/:projectId",
  validatorMiddleware(projectSchema.updateProjectSchema),
  projectController.updateProject,
);

router.delete(
  "/:projectId",
  validatorMiddleware(projectSchema.removeProjectSchema),
  projectController.removeProject,
);

router.post(
  "/add-member/:projectId",
  validatorMiddleware(projectSchema.addMemberSchema),
  projectController.addMember,
);

router.delete(
  "/remove-member/:projectId/:userId",
  validatorMiddleware(projectSchema.removeMemberSchema),
  projectController.removeProjectMember,
);

// Promote/ Demote project member
router.patch(
  "/promote/:projectId/:userId",
  validatorMiddleware(projectSchema.promoteMemberSchema),
  projectController.promoteProjectMember,
);

export default router;
