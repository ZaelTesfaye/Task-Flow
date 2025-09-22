"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = require("joi");
var addUserSchema = {
    body: joi_1.default.object({
        name: joi_1.default.string(),
    }),
};
var userSchemas = {
    addUserSchema: addUserSchema,
};
exports.default = userSchemas;
