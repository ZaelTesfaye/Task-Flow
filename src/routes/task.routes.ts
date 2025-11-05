import express from "express";
import { validatorMiddleware } from "../middlewares/index.js";
import {
  createTaskSchema,
  getTasksSchema,
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

// Get tasks for a project
router.get(
  "/:projectId",
  validatorMiddleware(getTasksSchema),
  taskController.getTasks,
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

export default router;
