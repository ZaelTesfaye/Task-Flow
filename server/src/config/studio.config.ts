import type { StudioConfig } from "better-auth-studio";
import { auth } from "../lib/auth.js";

const config: StudioConfig = {
  auth,
  basePath: "/api/admin/studio",
  access: {
    roles: ["admin"],
  },
  metadata: {
    title: "Admin Dashboard",
    theme: "dark",
  },
};

export default config;
