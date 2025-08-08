const express = require('express');
const userController = require('../controllers/user.controllers');
const userSchema = require("../validations/user.schema")
const validator = require('../middlewares/validator')

router = express.Router();

router.post('/add-user', validator(userSchema.addUserSchema), userController.addUser);

module.exports = router;