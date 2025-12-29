import { APIError } from "../utils/index.js";
import { envSchema, type EnvSchemaType } from "../validations/index.js";

const { value, error } = envSchema.validate(process.env);

if (error) {
  throw new APIError(`Config validation error: ${error.message}`, 500);
}

const envVars = value as EnvSchemaType;

const env = {
  port: envVars.PORT,
  env: envVars.NODE_ENV,
  jwtSecret: envVars.JWT_SECRET,
  frontEndUrl: envVars.FRONTEND_URL,
  adminName: envVars.ADMIN_NAME,
  adminEmail: envVars.ADMIN_EMAIL,
  adminPassword: envVars.ADMIN_PASSWORD,
  resendApiKey: envVars.RESEND_API_KEY,
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
  },
  betterAuthUrl: envVars.BETTER_AUTH_URL,
  stripe: {
    apiKey: envVars.STRIPE_API_KEY,
    starter: {
      productId: envVars.STRIPE_PRODUCT_STARTER_ID,
      priceId: envVars.STRIPE_PRICE_STARTER_ID,
    },
    pro: {
      productId: envVars.STRIPE_PRODUCT_PRO_ID,
      priceId: envVars.STRIPE_PRICE_PRO_ID,
    },
    webhookSecret: envVars.STRIPE_WEBHOOK_SECRET,
  },
};

export default env;
