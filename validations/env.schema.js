const joi = require('joi');

const envSchema = joi.object({
    PORT: joi.number().default(5000),
    NODE_ENV: joi.string().default("development")
}).unknown(); 

module.exports = envSchema;