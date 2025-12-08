import axios from "axios";
import type { AdminUser } from "../types";

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

  // Login using custom auth
  login: async (
    email: string,
    password: string
  ): Promise<{ token: string; user: AdminUser }> => {
    const response = await api.post("/api/custom-auth/login", {
      email,
      password,
    });
    return { token: "session", user: response.data.data.user };
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post("/api/custom-auth/logout");
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
