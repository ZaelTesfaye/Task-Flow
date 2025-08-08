const joi = require("joi");

const addTaskSchema = {
  body: joi.object({
    userId: joi.string().uuid(),
    description: joi.string,
  }),
};

const removeTaskSchema = {
  body: joi.object({
    userId: joi.string().uuid(),
    taskId: joi.string().uuid(),
  }),
};

const updateTaskStatusSchema = {
  body: joi.object({
    userId: joi.string().uuid(),
    taskId: joi.string().uuid(),
    status: joi.string().valid("active", "complete", "canceled"),
  }),
};

const getTaskSchema = {
  body: joi.object({
    userId: joi.string().uuid(),
  }),
};
module.exports = {
  addTaskSchema,
  getTaskSchema,
  removeTaskSchema,
  updateTaskStatus: updateTaskStatusSchema,
};
