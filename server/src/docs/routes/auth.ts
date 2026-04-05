import { registry } from "../registry.js";
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  AuthResponseSchema,
  RequestPasswordResetRequestSchema,
  VerifyResetCodeRequestSchema,
  ResetPasswordRequestSchema,
  ApiErrorResponseSchema,
} from "../../schemas/index.js";

registry.registerPath({
  method: "post",
  path: "/api/auth/register",
  tags: ["Authentication"],
  summary: "Register a new user",
  description: "Create a new user account",
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterRequestSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
      content: {
        "application/json": {
          schema: AuthResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/login",
  tags: ["Authentication"],
  summary: "Login",
  description: "Authenticate user and create session",
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginRequestSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login successful",
      content: {
        "application/json": {
          schema: AuthResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/password-reset-request",
  tags: ["Authentication"],
  summary: "Request password reset",
  description: "Request a password reset code",
  request: {
    body: {
      content: {
        "application/json": {
          schema: RequestPasswordResetRequestSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Reset code sent",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/verify-reset-code",
  tags: ["Authentication"],
  summary: "Verify reset code",
  description: "Verify password reset code",
  request: {
    body: {
      content: {
        "application/json": {
          schema: VerifyResetCodeRequestSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Code verified",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/reset-password",
  tags: ["Authentication"],
  summary: "Reset password",
  description: "Reset user password with verified code",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ResetPasswordRequestSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Password reset successful",
      content: {
        "application/json": {
          schema: ApiErrorResponseSchema,
        },
      },
    },
  },
});
