import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import type { OpenAPIObject } from "openapi3-ts/oas30";
import { registry } from "./registry.js";

// Import all route definitions
import "./routes/auth.js";
import "./routes/user.js";
import "./routes/project.js";
import "./routes/task.js";
import "./routes/phase.js";
import "./routes/members.js";
import "./routes/invitations.js";

export function generateOpenAPIDocument(): OpenAPIObject {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "TaskFlow API",
      description: "TaskFlow project management API",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
      {
        url: "https://api.taskflow.com/api",
        description: "Production server",
      },
    ],
  });
}
