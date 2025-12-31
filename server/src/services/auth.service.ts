import bcrypt from "bcrypt";
import { userModel } from "../model/index.js";
import { APIError } from "../utils/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { redis } from "../lib/index.js";
import * as emailServices from "./email.service.js";

export const register = async (
  name: string,
  email: string,
  password: string,
  role: string = "user",
) => {
  email = email.toLowerCase();
  //check if email already exists
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = await userModel.createUser(
    name,
    email,
    hashedPassword,
    role,
  );

  const tokenData = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
  };
  const token = await jwt.sign(tokenData, config.jwtSecret, {
    expiresIn: "7d",
  });

  return {
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
    token: token,
  };
};

export const login = async (email: string, password: string) => {
  // check if the user exists and password matches
  email = email.toLowerCase();
  const user = await userModel.findByEmail(email);

  if (!user) {
    throw new APIError("User not found", 404);
  }

  if (!user.password) {
    throw new APIError("Password not set", 400);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new APIError("Invalid username / password", 401);
  }
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userData, config.jwtSecret, {
    expiresIn: "7d",
  });

  return {
    user: userData,
    token,
  };
};

/**
 * Generate and send password reset code
 */
export const requestPasswordReset = async (email: string) => {
  email = email.toLowerCase();
  const user = await userModel.findByEmail(email);

  if (!user) {
    throw new APIError("User not found", 404);
  }

  // Generate 6-digit code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in Redis with 10 minute expiration
  const redisKey = `password_reset:${email}`;
  await redis.set(redisKey, resetCode, "EX", 600); // 10 minutes

  // Send email with code
  await emailServices.sendPasswordResetCode(user.name, email, resetCode);

  return { message: "Password reset code sent to your email" };
};

/**
 * Verify password reset code
 */
export const verifyResetCode = async (email: string, code: string) => {
  email = email.toLowerCase();
  const redisKey = `password_reset:${email}`;
  const storedCode = await redis.get(redisKey);

  if (!storedCode) {
    throw new APIError("Reset code expired or invalid", 400);
  }

  if (storedCode !== code) {
    throw new APIError("Invalid reset code", 400);
  }

  // Mark code as verified (store for 5 more minutes)
  const verifiedKey = `password_reset_verified:${email}`;
  await redis.set(verifiedKey, "true", "EX", 300); // 5 minutes

  return { message: "Code verified successfully" };
};

/**
 * Reset password with verified code
 */
export const resetPassword = async (email: string, newPassword: string) => {
  email = email.toLowerCase();

  // Check if code was verified
  const verifiedKey = `password_reset_verified:${email}`;
  const isVerified = await redis.get(verifiedKey);

  if (!isVerified) {
    throw new APIError(
      "Code not verified or expired. Please request a new code.",
      400,
    );
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new APIError("User not found", 404);
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await userModel.updateUser(user.id, { password: hashedPassword });

  // Clean up Redis keys
  await redis.del(`password_reset:${email}`);
  await redis.del(verifiedKey);

  // Auto-login: generate token
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userData, config.jwtSecret, {
    expiresIn: "7d",
  });

  return {
    user: userData,
    token,
    message: "Password reset successfully",
  };
};
