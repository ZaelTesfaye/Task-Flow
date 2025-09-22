"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = require("joi");
var envSchema = joi_1.default.object({
    PORT: joi_1.default.number().default(5000),
    NODE_ENV: joi_1.default.string().default("development"),
    JWT_SECRET: joi_1.default.string().required(),
}).unknown();
exports.default = envSchema;
