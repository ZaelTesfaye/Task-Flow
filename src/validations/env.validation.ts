import joi from "joi";

export interface EnvSchemaType {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  COOKIE_SECRET: string;
  FRONTEND_URL: string;
  ADMIN_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;


}

const envSchema = joi.object<EnvSchemaType>({
    PORT: joi.number().default(5000),
    NODE_ENV: joi.string().default("development").required(),
    JWT_SECRET: joi.string().required(),
    COOKIE_SECRET: joi.string().required(),
    FRONTEND_URL: joi.string().required(),
    ADMIN_NAME: joi.string().required(),
    ADMIN_EMAIL: joi.string().required(),
    ADMIN_PASSWORD: joi.string().required(),
  })
  .required().unknown(true)

export default envSchema;
