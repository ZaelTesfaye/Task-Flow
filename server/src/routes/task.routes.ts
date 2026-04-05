import express, { Router } from "express";
import { validatorMiddleware } from "../middlewares/index.js";
import {
  CreateTaskRequestSchema,
  UpdateTaskRequestSchema,
  RemoveTaskRequestSchema,
  RequestTaskUpdateRequestSchema,
  AcceptPendingUpdateRequestSchema,
} from "../schemas/index.js";
import { taskController } from "../controllers/index.js";

const router: Router = express.Router();

router.post("/:projectId/:phaseId", validatorMiddleware(CreateTaskRequestSchema), taskController.createTask);

router.patch("/:projectId/:taskId", validatorMiddleware(UpdateTaskRequestSchema), taskController.updateTask);

router.delete("/:projectId/:taskId", validatorMiddleware(RemoveTaskRequestSchema), taskController.removeTask);

router.post(
  "/request-update/:projectId/:taskId",
  validatorMiddleware(RequestTaskUpdateRequestSchema),
  taskController.requestTaskUpdate,
);

router.patch(
  "/accept-update/:projectId/:pendingUpdateId",
  validatorMiddleware(AcceptPendingUpdateRequestSchema),
  taskController.acceptPendingUpdate,
);

router.patch(
  "/reject-update/:projectId/:pendingUpdateId",
  validatorMiddleware(AcceptPendingUpdateRequestSchema),
  taskController.rejectPendingUpdate,
);

export default router;
