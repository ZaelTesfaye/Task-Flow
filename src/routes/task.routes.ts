import express from "express";
import { validatorMiddleware } from "../middlewares/index.js";
import * as taskSchema from "../validations/task.validation.js";
import * as taskController from "../controllers/task.controllers.js";

const router = express.Router();

router.post(
  "/:projectId/:categoryId",
  validatorMiddleware(taskSchema.createTaskSchema),
  taskController.createTask,
);

// Get tasks for a project
router.get(
  "/:projectId",
  validatorMiddleware(taskSchema.getTasksSchema),
  taskController.getTasks,
);

router.patch(
  "/:projectId/:taskId",
  validatorMiddleware(taskSchema.updateTaskSchema),
  taskController.updateTask,
);

router.delete(
  "/:projectId/:taskId",
  validatorMiddleware(taskSchema.removeTaskSchema),
  taskController.removeTask,
);

router.post(
  "/request-update/:projectId/:taskId",
  validatorMiddleware(taskSchema.requestTaskUpdateSchema),
  taskController.requestTaskUpdate,
);

router.patch(
  "/accept-update/:projectId/:pendingUpdateId",
  validatorMiddleware(taskSchema.acceptPendingUpdateSchema),
  taskController.acceptPendingUpdate,
);

export default router;
