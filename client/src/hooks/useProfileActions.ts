import toast from "react-hot-toast";

import { userApiClient, paymentApiClient } from "@/lib";
import { useAuthActions } from "./useAuthActions";
import type { UpdateUserRequest, ApiResponse } from "@/types";

export const useProfileActions = () => {
  const { updateUserData, logout } = useAuthActions();

  const handleUpdateProfile = async (data: UpdateUserRequest) => {
    const response = await userApiClient.patch<ApiResponse<any>>(data);
    updateUserData(response.data);
    toast.success("Profile updated successfully!");
  };

  const handleDeleteAccount = async () => {
    try {
      await userApiClient.delete();
      toast.success("Account deleted successfully");
      logout();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await paymentApiClient.post<{ url: string }>(
        undefined,
        "create-portal-session",
      );
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to open billing portal",
      );
    }
  };

  return {
    handleUpdateProfile,
    handleDeleteAccount,
    handleManageSubscription,
  };
};
