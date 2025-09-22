import joi from 'joi';

const envSchema = joi.object({
    PORT: joi.number().default(5000),
    NODE_ENV: joi.string().default("development"),
    JWT_SECRET: joi.string().required(),
}).unknown(); 

export default envSchema;