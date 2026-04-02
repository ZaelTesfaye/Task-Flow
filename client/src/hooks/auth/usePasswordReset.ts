import { useState } from "react";
import toast from "react-hot-toast";

import { authApi } from "@/lib";
import { useAuthActions } from "../auth/useAuthActions";

type ForgotPasswordStep = "email" | "code" | "password";

export const usePasswordReset = () => {
  const { checkSession } = useAuthActions();

  const [forgotPasswordStep, setForgotPasswordStep] = useState<ForgotPasswordStep>("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const handleForgotPassword = async () => {
    if (!resetEmail || !resetEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsResetting(true);
    try {
      await authApi.post({ email: resetEmail }, "forgot-password");
      toast.success("Reset code sent to your email!");
      setForgotPasswordStep("code");
    } catch (error: any) {
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
      await authApi.post({ email: resetEmail, code: resetCode }, "verify-reset-code");
      toast.success("Code verified! Set your new password.");
      setForgotPasswordStep("password");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid or expired code");
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetPassword = async (): Promise<boolean> => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    setIsResetting(true);
    try {
      await authApi.post({ email: resetEmail, newPassword }, "reset-password");
      toast.success("Password reset successful! Logging you in...");
      await checkSession();
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      return false;
    } finally {
      setIsResetting(false);
    }
  };

  const resetForgotPasswordState = () => {
    setForgotPasswordStep("email");
    setResetEmail("");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return {
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
  };
};
