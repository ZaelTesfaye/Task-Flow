"use client";

import { useState, useEffect, useRef } from "react";
import { LogIn, UserPlus, Mail, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

import { useAuth } from "@/context";
import { useThemeStore } from "@/stores";
import { LoginRequestSchema, RegisterRequestSchema } from "@/validation";
import type { LoginFormData, RegisterFormData } from "@/types";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { ThemeToggle } from "@/components/ui";
import { authAPI } from "@/lib";

type AuthFormData = {
  name?: string;
  email: string;
  password: string;
};

export default function LoginPage() {
  const { login, register, user, checkSession } = useAuth();
  const router = useRouter();
  const { theme } = useThemeStore();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Forgot password states
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"email" | "code" | "password">("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // logged in
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Detect when Google button iframe is loaded
  useEffect(() => {
    const checkGoogleLoaded = () => {
      if (googleButtonRef.current) {
        const iframe = googleButtonRef.current.querySelector("iframe");
        if (iframe) {
          setIsGoogleLoaded(true);
          return true;
        }
      }
      return false;
    };

    // Check immediately
    if (checkGoogleLoaded()) return;

    // Poll for iframe appearance
    const interval = setInterval(() => {
      if (checkGoogleLoaded()) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const validateForm = (): boolean => {
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
        toast.success(
          "Registration successful! Please check your email for the verification code."
        );
        router.push(
          `/verify-email?email=${encodeURIComponent(formData.email.trim())}`
        );
      } else {
        await login(formData as LoginFormData);
        toast.success("Login successful!");
        setFailedAttempts(0); // Reset on success
        router.push("/dashboard");
      }
    } catch (error: any) {
      if (mode === "login") {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          toast.error("Too many failed attempts. Please use Forgot Password.");
        } else {
          toast.error(`Login failed. ${3 - newAttempts} attempts remaining.`);
        }
      } else {
        toast.error("Registration failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail || !resetEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsResetting(true);
    try {
      await authAPI.requestPasswordReset(resetEmail);
      toast.success("Reset code sent to your email!");
      setForgotPasswordStep("code");
    } catch {
      toast.error(error.response?.data?.message || "Failed to send reset code");
    } finally {
      setIsResetting(false);
    }
  };

  const handleVerifyCode = async () => {
    if (resetCode.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setIsResetting(true);
    try {
      await authAPI.verifyResetCode(resetEmail, resetCode);
      toast.success("Code verified! Set your new password.");
      setForgotPasswordStep("password");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid or expired code");
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsResetting(true);
    try {
      await authAPI.resetPassword(resetEmail, newPassword);
      toast.success("Password reset successful! Logging you in...");
      
      // Auto-login with the response data
      await checkSession();
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsResetting(false);
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
    setFormData({
      name: "",
      email: "",
      password: "",
    });
    setFailedAttempts(0);
    setShowForgotPassword(false);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="flex items-center justify-center min-h-screen p-4 bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))]">
        {/* Theme Toggle*/}
        <div className="absolute z-10 top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md p-8 bg-[hsl(var(--card))] shadow-xl border border-[hsl(var(--border))] rounded-2xl">
          {/* Show Forgot Password UI if triggered */}
          {showForgotPassword ? (
            <div>
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-600 rounded-full">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">
                  Reset Password
                </h1>
                <p className="mt-2 text-[hsl(var(--muted-foreground))]">
                  {forgotPasswordStep === "email" && "Enter your email to receive a reset code"}
                  {forgotPasswordStep === "code" && "Enter the 6-digit code sent to your email"}
                  {forgotPasswordStep === "password" && "Set your new password"}
                </p>
              </div>

              <div className="space-y-6">
                {forgotPasswordStep === "email" && (
                  <>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-[hsl(var(--foreground))]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                        placeholder="john@example.com"
                      />
                    </div>
                    <button
                      onClick={handleForgotPassword}
                      disabled={isResetting}
                      className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResetting ? "Sending..." : "Send Reset Code"}
                    </button>
                  </>
                )}

                {forgotPasswordStep === "code" && (
                  <>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-[hsl(var(--foreground))]">
                        Reset Code
                      </label>
                      <input
                        type="text"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))] text-center text-2xl tracking-widest font-mono"
                        placeholder="000000"
                        maxLength={6}
                      />
                      <p className="mt-2 text-xs text-center text-[hsl(var(--muted-foreground))]">
                        Code sent to {resetEmail}
                      </p>
                    </div>
                    <button
                      onClick={handleVerifyCode}
                      disabled={isResetting || resetCode.length !== 6}
                      className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResetting ? "Verifying..." : "Verify Code"}
                    </button>
                  </>
                )}

                {forgotPasswordStep === "password" && (
                  <>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-[hsl(var(--foreground))]">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-[hsl(var(--foreground))]">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      onClick={handleResetPassword}
                      disabled={isResetting || !newPassword || newPassword !== confirmPassword}
                      className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResetting ? "Resetting..." : "Reset Password"}
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordStep("email");
                    setResetEmail("");
                    setResetCode("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="w-full py-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                >
                  Back to Login
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Normal Login/Register Form */}
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

            {/* Show Forgot Password button after 3 failed attempts */}
            {mode === "login" && failedAttempts >= 3 && (
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setResetEmail(formData.email);
                }}
                className="w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Forgot Password?
              </button>
            )}

            <div className="flex justify-center w-full mt-4">
              {/* Custom styled container with Google's button as overlay */}
              <div
                className={`relative w-full group ${isGoogleLoaded ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                {/* Loading Overlay */}
                {isGoogleLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-neutral-800/80 rounded-lg backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Signing in...
                      </span>
                    </div>
                  </div>
                )}

                {/* Custom visual button (underneath) */}
                <div
                  className={`
                    flex items-center justify-center w-full px-4 py-3 
                    font-medium transition-all duration-200 ease-in-out
                    bg-white dark:bg-neutral-800 
                    border border-gray-200 dark:border-neutral-700 
                    rounded-lg shadow-sm 
                    ${isGoogleLoaded ? "group-hover:shadow-md group-hover:bg-gray-50 dark:group-hover:bg-neutral-700 group-hover:border-gray-300 dark:group-hover:border-neutral-600" : "opacity-50"}
                    pointer-events-none
                  `}
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5 mr-3"
                  />
                  <span className="text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                    Sign in with Google
                  </span>
                </div>

                {/* Google's actual button (transparent overlay on top - clickable) */}
                <div
                  ref={googleButtonRef}
                  className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg [&_iframe]:!w-full [&_iframe]:!h-full [&_div]:!w-full [&_div]:!h-full ${!isGoogleLoaded ? "pointer-events-none" : ""}`}
                  style={{ opacity: 0.01 }}
                >
                  <GoogleLogin
                    onSuccess={async (
                      credentialResponse: CredentialResponse
                    ) => {
                      if (credentialResponse.credential) {
                        setIsGoogleLoading(true);
                        try {
                          await authClient.signIn.social({
                            provider: "google",
                            idToken: {
                              token: credentialResponse.credential,
                            },
                          });
                          await checkSession();
                          toast.success("Login successful!");
                          router.push("/dashboard");
                        } catch (error) {
                          toast.error("Google Login failed.");
                          setIsGoogleLoading(false);
                        }
                      }
                    }}
                    onError={() => {
                      toast.error("Google Login Failed");
                    }}
                    useOneTap
                    auto_select
                    theme={theme === "dark" ? "filled_black" : "outline"}
                    size="large"
                    width={400}
                  />
                </div>
              </div>
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
            </>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
