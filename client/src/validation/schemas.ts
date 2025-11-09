import { z } from "zod";

// User Types
export const UserSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Auth Types
export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string().optional(),
});

export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const RegisterRequestSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export const UpdateUserRequestSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
});

// Project Types
export const ProjectSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ProjectWithMembersSchema = ProjectSchema.extend({
  members: z.array(z.lazy(() => ProjectMemberSchema)).optional(),
});

export const CreateProjectRequestSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
});

export const UpdateProjectRequestSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
});

export const UserProjectsResponseSchema = z.object({
  owner: z.array(ProjectSchema),
  admin: z.array(ProjectSchema),
  member: z.array(ProjectSchema),
});

// Project Member Types
export const ProjectMemberSchema = z.object({
  id: z.string(),
  userId: z.string(),
  projectId: z.string(),
  access: z.enum(["admin", "member"]),
  user: UserSchema,
});

export const AddMemberRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  access: z.enum(["admin", "member"]).optional(),
});

export const UpdateMemberRequestSchema = z.object({
  access: z.enum(["admin", "member"]),
});

// Category Types
export const CategorySchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  projectId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateCategoryRequestSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
});

export const UpdateCategoryRequestSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
});

// Task Types
export const TaskSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  status: z.enum(["active", "complete", "canceled"]),
  assignedTo: z.string(),
  categoryId: z.string(),
  projectId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  assignedUser: UserSchema.optional(),
  pendingUpdates: z.array(z.lazy(() => PendingUpdateSchema)).optional(),
});

export const CreateTaskRequestSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  assignedTo: z.string().min(1, "Assignee is required"),
});

export const UpdateTaskRequestSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  status: z.enum(["active", "complete", "canceled"]).optional(),
  categoryId: z.string().optional(),
});

export const TasksResponseSchema = z.object({
  project: ProjectSchema,
  categories: z.array(z.lazy(() => CategoryWithTasksSchema)),
});

export const CategoryWithTasksSchema = CategorySchema.extend({
  tasks: z.array(TaskSchema),
});

// Pending Update Types
export const PendingUpdateSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  requestedBy: z.string(),
  updateDescription: z.string().min(1, "Update description is required"),
  newStatus: z.enum(["active", "complete", "canceled"]),
  createdAt: z.string(),
});

export const RequestUpdateRequestSchema = z.object({
  updateDescription: z.string().min(1, "Update description is required"),
  newStatus: z.enum(["active", "complete", "canceled"]),
});

export const AcceptUpdateRequestSchema = z.object({
  newStatus: z.enum(["active", "complete", "canceled"]),
});

// Admin Types
export const AdminUserSchema = UserSchema.extend({
  role: z.string(),
});

export const UpdateUserRoleRequestSchema = z.object({
  role: z.string().min(1, "Role is required"),
});

export const SystemStatsSchema = z.object({
  totalUsers: z.number(),
  totalProjects: z.number(),
  totalTasks: z.number(),
  activeTasks: z.number(),
  completedTasks: z.number(),
});

// API Response Types
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
  });

// Error Types
export const ApiErrorSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  errors: z.any().optional(),
});

// Form validation helpers
export type LoginFormData = z.infer<typeof LoginRequestSchema>;
export type RegisterFormData = z.infer<typeof RegisterRequestSchema>;
export type CreateProjectFormData = z.infer<typeof CreateProjectRequestSchema>;
export type UpdateProjectFormData = z.infer<typeof UpdateProjectRequestSchema>;
export type CreateCategoryFormData = z.infer<
  typeof CreateCategoryRequestSchema
>;
export type CreateTaskFormData = z.infer<typeof CreateTaskRequestSchema>;
export type UpdateTaskFormData = z.infer<typeof UpdateTaskRequestSchema>;
export type AddMemberFormData = z.infer<typeof AddMemberRequestSchema>;
export type UpdateUserFormData = z.infer<typeof UpdateUserRequestSchema>;
export type RequestUpdateFormData = z.infer<typeof RequestUpdateRequestSchema>;
