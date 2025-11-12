import express from "express";
import { validatorMiddleware } from "../middlewares/index.js";
import {
  createTaskSchema,
  updateTaskSchema,
  removeTaskSchema,
  requestTaskUpdateSchema,
  acceptPendingUpdateSchema,
} from "../validations/index.js";
import { taskController } from "../controllers/index.js";

const router = express.Router();

router.post(
  "/:projectId/:categoryId",
  validatorMiddleware(createTaskSchema),
  taskController.createTask,
);

router.patch(
  "/:projectId/:taskId",
  validatorMiddleware(updateTaskSchema),
  taskController.updateTask,
);

router.delete(
  "/:projectId/:taskId",
  validatorMiddleware(removeTaskSchema),
  taskController.removeTask,
);

router.post(
  "/request-update/:projectId/:taskId",
  validatorMiddleware(requestTaskUpdateSchema),
  taskController.requestTaskUpdate,
);

router.patch(
  "/accept-update/:projectId/:pendingUpdateId",
  validatorMiddleware(acceptPendingUpdateSchema),
  taskController.acceptPendingUpdate,
);

router.patch(
  "/reject-update/:projectId/:pendingUpdateId",
  validatorMiddleware(acceptPendingUpdateSchema),
  taskController.rejectPendingUpdate,
);

export default router;
