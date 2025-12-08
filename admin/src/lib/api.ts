import axios from "axios";
import type { AdminUser } from "../types";
import { authClient } from "./auth-client";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Remove JWT interceptor, Better Auth uses session cookies

export const adminAPI = {
  getAllUsers: async (
    page: number = 1,
    limit: number = 10
  ): Promise<AdminUser[]> => {
    const response = await api.get<AdminUser[]>(
      `/api/admin/user/${page}/${limit}`
    );
    return response.data;
  },

  // Remove user
  removeUser: async (userId: string): Promise<void> => {
    await api.delete(`/api/admin/user/${userId}`);
  },

  // Update user password
  updateUserPassword: async (
    userId: string,
    newPassword: string
  ): Promise<void> => {
    await api.patch("/api/admin/user", { userId, password: newPassword });
  },

  // Login using Better Auth
  login: async (
    email: string,
    password: string
  ): Promise<{ token: string; user: AdminUser }> => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) throw new Error(result.error.message);
    return { token: "session", user: result.data.user as unknown as AdminUser };
  },

  // Create new admin (super-admin functionality)
  createAdmin: async (
    username: string,
    name: string,
    password: string
  ): Promise<void> => {
    await api.post("/api/super-admin/create-admin", {
      username,
      name,
      password,
    });
  },
};

export default api;
