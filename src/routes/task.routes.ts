import express from "express";
import * as taskController from "../controllers/task.controllers.js";
import taskSchema from "../validations/task.validation.js";
import { validatorMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.get(
  "/get-tasks/:userId",
  validatorMiddleware(taskSchema.getTaskSchema),
  taskController.getTasks,
);

router.post(
  "/add-task",
  validatorMiddleware(taskSchema.addTaskSchema),
  taskController.addTask,
);

router.patch(
  "/update",
  validatorMiddleware(taskSchema.updateTaskStatusSchema),
  taskController.updateTask,
);

router.delete(
  "/remove",
  validatorMiddleware(taskSchema.removeTaskSchema),
  taskController.removeTask,
);

export default router;
