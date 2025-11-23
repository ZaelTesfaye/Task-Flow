import axios from "axios";
import type { AdminUser, ApiResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAPI = {
  // Get all users with pagination
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

  // Login (assuming there's a login endpoint for admin)
  login: async (
    email: string,
    password: string
  ): Promise<{ token: string; user: AdminUser }> => {
    const response = await api.post<
      ApiResponse<{ token: string; user: AdminUser }>
    >("/api/auth/admin-login", { email, password });
    return response.data.data;
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
