import express from 'express';
import taskController from '../controllers/task.controllers.js';
import taskSchema from "../validations/task.schema.js";
import validator from "../middlewares/validator.middleware.js";

const router = express.Router();

router.get('/get-tasks/:userId', validator(taskSchema.getTaskSchema), taskController.getTasks);

router.post('/add-task', validator(taskSchema.addTaskSchema), taskController.addTask);

router.patch("/update", validator(taskSchema.updateTaskStatusSchema),taskController.updateTaskStatus)

router.delete("/remove", validator(taskSchema.removeTaskSchema), taskController.removeTask) 

export default router;