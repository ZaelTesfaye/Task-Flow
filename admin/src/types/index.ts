export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser extends User {
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedUsers {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdatePasswordRequest {
  userId: string;
  newPassword: string;
}
