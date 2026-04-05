import express, { Router } from "express";
import { projectController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";
import {
  CreateProjectRequestSchema,
  UpdateProjectRequestSchema,
  RemoveProjectRequestSchema,
  AddMemberRequestSchema,
  UpdateMemberRequestSchema,
  RemoveMemberRequestSchema,
  GetProjectMembersRequestSchema,
  GetProjectInvitationsRequestSchema,
  RespondInvitationRequestSchema,
} from "../schemas/index.js";

const router: Router = express.Router();

router.post("/", validatorMiddleware(CreateProjectRequestSchema), projectController.createProject);

router.get("/", projectController.getUserProjects);

router.patch("/:projectId", validatorMiddleware(UpdateProjectRequestSchema), projectController.updateProject);

router.delete("/:projectId", validatorMiddleware(RemoveProjectRequestSchema), projectController.removeProject);

router.post("/member/:projectId", validatorMiddleware(AddMemberRequestSchema), projectController.addMember);

router.get(
  "/member/:projectId",
  validatorMiddleware(GetProjectMembersRequestSchema),
  projectController.getProjectMembers,
);

router.get(
  "/member/:projectId/invitations",
  validatorMiddleware(GetProjectInvitationsRequestSchema),
  projectController.getProjectInvitations,
);

router.patch(
  "/member/:projectId/:userId",
  validatorMiddleware(UpdateMemberRequestSchema),
  projectController.promoteProjectMember,
);

router.delete(
  "/member/:projectId/:userId",
  validatorMiddleware(RemoveMemberRequestSchema),
  projectController.removeProjectMember,
);

router.get("/invitations", projectController.getUserInvitations);

router.patch(
  "/invitations/:invitationId",
  validatorMiddleware(RespondInvitationRequestSchema),
  projectController.respondToInvitation,
);

export default router;
