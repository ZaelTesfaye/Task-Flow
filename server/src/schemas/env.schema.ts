import { z } from "zod";

export const envSchema = z
  .object({
    PORT: z.coerce.number().default(5000),
    NODE_ENV: z.string().default("development"),
    JWT_SECRET: z.string().min(1),
    FRONTEND_URL: z.string().refine(
      (val) => {
        // Support comma-separated URLs
        const urls = val.split(",").map((url) => url.trim());
        return urls.every((url) => {
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        });
      },
      {
        message: "FRONTEND_URL must be a valid URL or comma-separated list of valid URLs",
      },
    ),
    ADMIN_NAME: z.string().min(1),
    ADMIN_EMAIL: z.string().email(),
    ADMIN_PASSWORD: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    STRIPE_API_KEY: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    STRIPE_PRODUCT_STARTER_ID: z.string().min(1),
    STRIPE_PRICE_STARTER_ID: z.string().min(1),
    STRIPE_PRODUCT_PRO_ID: z.string().min(1),
    STRIPE_PRICE_PRO_ID: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    REDIS_URL: z.string().url(),
  })
  .passthrough();

export type EnvSchemaType = z.infer<typeof envSchema>;

export default envSchema;
