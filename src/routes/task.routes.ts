import express from 'express';
import taskController from '../controllers/task.controllers.ts';
import taskSchema from "../validations/task.validation.ts";
import validator from "../middlewares/validator.middleware.ts";

const router = express.Router();

router.get('/get-tasks/:userId', validator(taskSchema.getTaskSchema), taskController.getTasks);

router.post('/add-task', validator(taskSchema.addTaskSchema), taskController.addTask);

router.patch("/update", validator(taskSchema.updateTaskStatusSchema),taskController.updateTask);

router.delete("/remove", validator(taskSchema.removeTaskSchema), taskController.removeTask);

export default router;