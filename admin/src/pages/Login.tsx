import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { authApiClient } from "../lib/api-client";
import type { AdminUser } from "../types";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const checkExistingSession = async () => {
      if (!localStorage.getItem("adminUser")) return;

      try {
        const session = await authApiClient.get<{ user: AdminUser | null }>(
          "get-session",
        );

        if (session.user && (session.user.role === "admin" || session.user.role === "owner")) {
          navigate("/users-custom", { replace: true });
          return;
        }
      } catch {
        // Fall through and clear stale local state.
      }

      localStorage.removeItem("adminUser");
    };

    void checkExistingSession();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await authApiClient.post({ email, password }, "sign-in/email");
      const session = await authApiClient.get<{ user: AdminUser | null }>(
        "get-session",
      );

      if (
        !session.user ||
        (session.user.role !== "admin" && session.user.role !== "owner")
      ) {
        await authApiClient.post(undefined, "sign-out");
        throw new Error("Only admin users can access this app");
      }

      localStorage.setItem("adminUser", JSON.stringify(session.user));
      toast.success("Login successful!");
      navigate("/users-custom", { replace: true });
    } catch {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: "email" | "password", value: string) => {
    if (field === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[hsl(var(--background))]">
      <Toaster position="top-right" />
      <div className="w-full max-w-md p-8 border shadow-xl bg-[hsl(var(--card))] border-[hsl(var(--border))] rounded-2xl text-[hsl(var(--card-foreground))]">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-600 rounded-full">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">
            Admin Portal
          </h1>
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label
              htmlFor="email"
              className="block mb-2 text-sm font-medium"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="text"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-[hsl(var(--background))] text-[hsl(var(--foreground))] ${
                errors.email
                  ? "border-red-500"
                  : "border-[hsl(var(--border))]"
              }`}
              placeholder="admin@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block mb-2 text-sm font-medium"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-[hsl(var(--background))] text-[hsl(var(--foreground))] ${
                errors.password
                  ? "border-red-500"
                  : "border-[hsl(var(--border))]"
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Secure admin access only
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
