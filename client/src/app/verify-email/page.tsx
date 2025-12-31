"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkSession } = useAuth();
  const email = searchParams.get("email")?.trim() ?? "";
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrorMessage("Please enter the verification code");
      return;
    }

    if (!email) {
      setStatus("error");
      setErrorMessage("Missing email address. Please restart the signup flow.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: code.trim(),
      });

      if (error) {
        console.error(error);
        setStatus("error");
        setErrorMessage(error.message || "Invalid verification code");
      } else {
        setStatus("success");
        // Update session and redirect to dashboard
        await checkSession();
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (e) {
      console.error(e);
      setStatus("error");
      setErrorMessage("An error occurred during verification");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-20 h-20 mb-6 text-green-500" />
            <h2 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
              Email Verified!
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-8 max-w-md">
              Your email has been successfully verified. You can now access all
              features of TaskFlow.
            </p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <Mail className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
            Verify Your Email
          </h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            We&apos;ve sent a 6-digit verification code to{" "}
            {email || "your email"}. Enter it below to verify your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2"
            >
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={6}
              required
            />
          </div>

          {errorMessage && (
            <div className="flex items-center justify-center space-x-2 text-red-500">
              <XCircle className="w-5 h-5" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading" || code.length !== 6}
            className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify Email</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
            Didn&apos;t receive the code? Check your spam folder or try signing
            up again.
          </p>
          <Link
            href="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
