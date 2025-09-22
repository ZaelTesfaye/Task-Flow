"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = require("joi");
var registerSchema = {
    body: joi_1.default.object({
        name: joi_1.default.string().min(3).max(30).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).max(18).required(),
    })
        .unknown(true),
};
var loginSchema = {
    body: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required()
    })
        .unknown(true),
};
var authSchemas = {
    registerSchema: registerSchema,
    loginSchema: loginSchema
};
exports.default = authSchemas;
