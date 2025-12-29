import joi from "joi";

export interface EnvSchemaType {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  FRONTEND_URL: string;
  ADMIN_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  RESEND_API_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  STRIPE_API_KEY: string;
  BETTER_AUTH_URL: string;
  STRIPE_PRODUCT_STARTER_ID: string;
  STRIPE_PRICE_STARTER_ID: string;
  STRIPE_PRODUCT_PRO_ID: string;
  STRIPE_PRICE_PRO_ID: string;
  STRIPE_WEBHOOK_SECRET: string;
}

export const envSchema = joi
  .object<EnvSchemaType>({
    PORT: joi.number().default(5000),
    NODE_ENV: joi.string().default("development").required(),
    JWT_SECRET: joi.string().required(),
    FRONTEND_URL: joi.string().required(),
    ADMIN_NAME: joi.string().required(),
    ADMIN_EMAIL: joi.string().required(),
    ADMIN_PASSWORD: joi.string().required(),
    RESEND_API_KEY: joi.string().required(),
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_SECRET: joi.string().required(),
    STRIPE_API_KEY: joi.string().required(),
    BETTER_AUTH_URL: joi.string().uri().required(),
    STRIPE_PRODUCT_STARTER_ID: joi.string().required(),
    STRIPE_PRICE_STARTER_ID: joi.string().required(),
    STRIPE_PRODUCT_PRO_ID: joi.string().required(),
    STRIPE_PRICE_PRO_ID: joi.string().required(),
    STRIPE_WEBHOOK_SECRET: joi.string().required(),
  })
  .required()
  .unknown(true);

export default envSchema;
