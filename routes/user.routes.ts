import express from 'express';
import userController from '../controllers/user.controllers.js';
import userSchema from "../validations/user.schema.js";
import validator from '../middlewares/validator.middleware.js';

const router = express.Router();

router.post('/add-user', validator(userSchema.addUserSchema), userController.addUser);

export default router;