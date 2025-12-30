import "dotenv/config";

import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma.js";
import config from "../config/config.js";
import { APIError } from "../utils/error.js";
import httpStatus from "http-status";
import logger from "./logger.js";
import resend from "./email.js";

export const auth = betterAuth({
  baseURL: config.betterAuthUrl,
  socialProviders: {
    google: {
      clientId: config.google.clientId,
      clientSecret: config.google.clientSecret,
      prompt: "select_account",
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        input: false, // false - users can't set it
      },
    },
  },
  trustedOrigins: config.frontEndUrl?.split(",")?.map((o) => o.trim()),
  cookie: {
    secure: config.env === "production",
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      expiresIn: 600,
      sendVerificationOTP: async ({ email, otp }) => {
        const verificationUrl = `${config.frontEndUrl?.split(",")?.map((o) => o.trim())[0]}/verify-email?email=${encodeURIComponent(email)}`;

        try {
          await resend.emails.send({
            from: "TaskFlow <no-reply@info.task-flows.tech>",
            to: email,
            subject: "Verify your email address - TaskFlow",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to TaskFlow!</h2>
                <p>Please verify your email address using the code below:</p>
                <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 20px; text-align: center; margin: 20px 0;">
                  <h3 style="color: #007bff; font-size: 24px; margin: 0; letter-spacing: 4px;">${otp}</h3>
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't sign up for TaskFlow, you can ignore this email.</p>
                <p style="font-size: 12px; color: #666;">Need help? Verify here: <a href="${verificationUrl}">${verificationUrl}</a></p>
              </div>
            `,
          });
        } catch (error) {
          logger.error("Error sending verification email:", error);
          throw new APIError(
            "Failed to send verification email",
            httpStatus.BAD_GATEWAY,
          );
        }
      },
    }),
  ],
});
