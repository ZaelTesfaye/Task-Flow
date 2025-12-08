import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/auth`
    : "http://localhost:5000/api/auth",
  fetchOptions: {
    credentials: "include",
  },
});
