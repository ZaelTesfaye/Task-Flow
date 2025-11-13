import { User } from "./user.type";
import z from "zod";
import { LoginRequestSchema, RegisterRequestSchema } from "@/validation";

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export type LoginFormData = z.infer<typeof LoginRequestSchema>;

export type RegisterFormData = z.infer<typeof RegisterRequestSchema>;
