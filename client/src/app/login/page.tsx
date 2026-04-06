"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { LogIn, UserPlus, Mail, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";

import { useAuthContext } from "@/context";
import { useAuthActions, usePasswordReset } from "@/hooks";
import { useThemeStore } from "@/stores";
import { LoginRequestSchema, RegisterRequestSchema } from "@/validation";
import type { LoginFormData, RegisterFormData } from "@/types";
import { ThemeToggle } from "@/components";

type AuthFormData = {
  name?: string;
  email: string;
  password: string;
};

export default function LoginPage() {
  const { user } = useAuthContext();
  const { login, register, handleGoogleLogin } = useAuthActions();
  const router = useRouter();
  const { theme } = useThemeStore();

  const {
    forgotPasswordStep,
    resetEmail,
    setResetEmail,
    resetCode,
    setResetCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isResetting,
    handleForgotPassword,
    handleVerifyCode,
    handleResetPassword,
    resetForgotPasswordState,
  } = usePasswordReset();

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
  const maxFailedAttempts = 3;

  useEffect(() => {
    // logged in
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Detect when google button iframe is loaded
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

    if (checkGoogleLoaded()) return;

    // Use MutationObserver to detect DOM changes instead of polling
    const observer = new MutationObserver(() => {
      if (checkGoogleLoaded()) {
        observer.disconnect();
      }
    });

    if (googleButtonRef.current) {
      observer.observe(googleButtonRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => observer.disconnect();
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
        toast.success("Registration successful! Please check your email for the verification code.");
        router.push(`/verify-email?email=${encodeURIComponent(formData.email.trim())}`);
      } else {
        await login(formData as LoginFormData);
        toast.success("Login successful!");
        setFailedAttempts(0); // Reset on success
        router.push("/dashboard");
      }
    } catch {
      if (mode === "login") {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
      } else {
        toast.error("Registration failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordClick = async () => {
    await handleForgotPassword();
  };

  const handleVerifyCodeClick = async () => {
    await handleVerifyCode();
  };

  const handleResetPasswordClick = async () => {
    const success = await handleResetPassword();
    if (success) {
      router.push("/dashboard");
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
    resetForgotPasswordState();
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))] p-4 dark:bg-[hsl(var(--background))]">
        {/* Theme Toggle*/}
        <div className="absolute z-10 right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-xl">
          {/* Forgot Password Ui */}
          {showForgotPassword ? (
            <div>
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-600 rounded-full">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Reset Password</h1>
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
                      <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-[hsl(var(--foreground))] outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>
                    <button
                      onClick={handleForgotPasswordClick}
                      disabled={isResetting}
                      className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isResetting ? "Sending..." : "Send Reset Code"}
                    </button>
                  </>
                )}

                {forgotPasswordStep === "code" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">Reset Code</label>
                      <input
                        type="text"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-center font-mono text-2xl tracking-widest text-[hsl(var(--foreground))] outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        placeholder="000000"
                        maxLength={6}
                      />
                      <p className="mt-2 text-center text-xs text-[hsl(var(--muted-foreground))]">
                        Code sent to {resetEmail}
                      </p>
                    </div>
                    <button
                      onClick={handleVerifyCodeClick}
                      disabled={isResetting || resetCode.length !== 6}
                      className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isResetting ? "Verifying..." : "Verify Code"}
                    </button>
                  </>
                )}

                {forgotPasswordStep === "password" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-[hsl(var(--foreground))] outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-[hsl(var(--foreground))] outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      onClick={handleResetPasswordClick}
                      disabled={isResetting || !newPassword || newPassword !== confirmPassword}
                      className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isResetting ? "Resetting..." : "Reset Password"}
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    resetForgotPasswordState();
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
                  {mode === "login" ? "Sign in to your account" : "Join us to manage your tasks"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === "register" && (
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-[hsl(var(--foreground))] outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-[hsl(var(--foreground))] outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-[hsl(var(--foreground))] outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-[hsl(var(--primary-foreground))] transition hover:cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                      <span>{mode === "login" ? "Signing in..." : "Creating account..."}</span>
                    </>
                  ) : mode === "login" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Show Forgot Password button after 3 failed attempts */}
                {mode === "login" && failedAttempts >= maxFailedAttempts && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setResetEmail(formData.email);
                    }}
                    className="flex items-center justify-center w-full gap-2 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Mail className="w-4 h-4" />
                    Forgot Password?
                  </button>
                )}

                <div className="flex justify-center w-full mt-4">
                  {/* Custom styled container with Google's button as overlay */}
                  <div className={`group relative w-full ${isGoogleLoaded ? "cursor-pointer" : "cursor-not-allowed"}`}>
                    {/* Loading Overlay */}
                    {isGoogleLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm dark:bg-neutral-800/80">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-200">Signing in...</span>
                        </div>
                      </div>
                    )}

                    {/* Custom visual button (underneath) */}
                    <div
                      className={`flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-3 font-medium shadow-sm transition-all duration-200 ease-in-out dark:border-neutral-700 dark:bg-neutral-800 ${isGoogleLoaded ? "group-hover:border-gray-300 group-hover:bg-gray-50 group-hover:shadow-md dark:group-hover:border-neutral-600 dark:group-hover:bg-neutral-700" : "opacity-50"} pointer-events-none`}
                    >
                      <Image
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-5 h-5 mr-3"
                        width={20}
                        height={20}
                      />
                      <span className="text-gray-700 group-hover:text-gray-900 dark:text-gray-200 dark:group-hover:text-white">
                        Sign in with Google
                      </span>
                    </div>

                    {/* Google's actual button (transparent overlay on top - clickable) */}
                    <div
                      ref={googleButtonRef}
                      className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg [&_div]:!h-full [&_div]:!w-full [&_iframe]:!h-full [&_iframe]:!w-full ${!isGoogleLoaded ? "pointer-events-none" : ""}`}
                      style={{ opacity: 0.01 }}
                    >
                      <GoogleLogin
                        onSuccess={(credentialResponse: CredentialResponse) => {
                          if (credentialResponse.credential) {
                            handleGoogleLogin(credentialResponse.credential, setIsGoogleLoading);
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
                  className="font-semibold text-blue-600 hover:cursor-pointer hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
