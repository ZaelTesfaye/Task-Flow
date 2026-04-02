import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { userApi } from "@/lib";

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const updateProfile = async (data: { name?: string; email?: string; image?: string }) => {
    await userApi.patch(data);
    toast.success("Profile updated!");
    await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
  };

  const updateSettings = async (settings: Record<string, any>) => {
    await userApi.patch({ settings }, "settings");
    toast.success("Settings updated!");
    await queryClient.invalidateQueries({ queryKey: ["user-settings"] });
  };

  const deleteAccount = async () => {
    await userApi.delete("");
    toast.success("Account deleted!");
    await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
  };

  return {
    updateProfile,
    updateSettings,
    deleteAccount,
  };
};
