import toast from "react-hot-toast";

import { userApi, paymentApi } from "@/lib";
import { useAuthActions } from "../auth/useAuthActions";
import type { UpdateUserRequest, ApiResponse } from "@/types";

export const useProfileActions = () => {
  const { updateUserData, logout } = useAuthActions();

  const updateProfile = async (data: UpdateUserRequest) => {
    const response = await userApi.patch<ApiResponse<any>>(data);
    updateUserData(response.data);
    toast.success("Profile updated successfully!");
  };

  const deleteAccount = async () => {
    try {
      await userApi.delete();
      toast.success("Account deleted successfully");
      logout();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  const manageSubscription = async () => {
    try {
      const response = await paymentApi.post<{ url: string }>(undefined, "create-portal-session");
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to open billing portal");
    }
  };

  return {
    updateProfile,
    deleteAccount,
    manageSubscription,
  };
};
