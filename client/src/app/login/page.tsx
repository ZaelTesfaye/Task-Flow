"use client";

import { useState, useEffect } from "react";
import { LogIn, UserPlus, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useSignIn } from "better-auth/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

import { useAuth } from "@/context";
import { useThemeStore } from "@/stores";
import { LoginRequestSchema, RegisterRequestSchema } from "@/validation";
import type { LoginFormData, RegisterFormData } from "@/types";

type AuthFormData = {
  name?: string;
  email: string;
  password: string;
};

export default function LoginPage() {
  const { login, register, user } = useAuth();
  // const signIn = useSignIn();
  const router = useRouter();
  const { theme, setTheme } = useThemeStore();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const validateForm = (): boolean => {
    console.log("Validating form");
    try {
      if (mode === "register") {
        RegisterRequestSchema.parse(formData);
      } else {
        LoginRequestSchema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (error: any) {
      const validationErrors: Partial<AuthFormData> = {};
      error.issues.forEach((err: any) => {
        const field = err.path[0] as keyof AuthFormData;
        validationErrors[field] = err.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (mode === "register") {
        await register(formData as RegisterFormData);
        toast.success("Registration successful!");
      } else {
        await login(formData as LoginFormData);
        toast.success("Login successful!");
      }
      router.push("/dashboard");
    } catch (error) {
      if (mode === "login") {
        toast.error("Login failed.");
      } else {
        toast.error("Registration failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleLoginMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setErrors({});
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))]">
      {/* Theme Switcher Button*/}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="hover:cursor-pointer absolute top-4 right-4 p-2 rounded-full bg-[hsl(var(--muted))] hover:bg-[hsl(var(--accent))] transition-colors z-10"
        title="Toggle theme"
      >
        {theme === "dark" ? (
          <Moon className="w-5 h-5 text-[hsl(var(--foreground))]" />
        ) : (
          <Sun className="w-5 h-5 text-[hsl(var(--foreground))]" />
        )}
      </button>

      <div className="w-full max-w-md p-8 bg-[hsl(var(--card))] shadow-xl border border-[hsl(var(--border))] rounded-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-600 rounded-full">
            {mode === "login" ? (
              <LogIn className="w-8 h-8 text-white" />
            ) : (
              <UserPlus className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">
            {mode === "login"
              ? "Sign in to your account"
              : "Join us to manage your tasks"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "register" && (
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-[hsl(var(--foreground))]"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))] ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-[hsl(var(--foreground))]"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))] ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-[hsl(var(--foreground))]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))] ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 dark:text-white font-semibold text-[hsl(var(--primary-foreground))] transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            {isLoading
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>

          {/* Better Auth GitHub Sign In */}
          <div className="mt-4">
            <button
              onClick={() => authClient.signIn.social({ provider: "github" })}
              className="w-full py-3 font-semibold text-white transition bg-gray-800 rounded-lg hover:bg-gray-900 hover:cursor-pointer"
            >
              Sign in with GitHub
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={toggleLoginMode}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:cursor-pointer"
          >
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
