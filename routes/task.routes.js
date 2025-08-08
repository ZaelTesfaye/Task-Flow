const express = require('express');
const taskController = require('../controllers/task.controllers');
const taskSchema = require("../validations/task.schema")
const validator = require("../middlewares/validator");

router = express.Router();

router.post('/get-tasks', validator(taskSchema.getTaskSchema), taskController.getTasks);

router.post('/add-task', validator(taskSchema.addTaskSchema), taskController.addTask);

router.patch("/update", validator(taskSchema.updateTaskStatus),taskController.updateTaskStatus)

router.delete("/remove", validator(taskSchema.removeTaskSchema), taskController.removeTask) 

module.exports = router;