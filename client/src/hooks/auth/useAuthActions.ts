import { useAuthContext } from "@/context";
import { authClient } from "@/lib/auth-client";
import { userApi } from "@/lib";
import type { User } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

export const useAuthActions = () => {
  const { setUser, setLoading } = useAuthContext();
  const queryClient = useQueryClient();

  const login = async (data: { email: string; password: string }) => {
    const { data: result } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result?.user) {
      queryClient.clear();
      setUser(result.user);
    } else {
      throw new Error("Login failed");
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    const { data: result } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    await authClient.sendVerificationEmail({ email: data.email });

    return result;
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      queryClient.clear();
    } catch (error) {
      throw error;
    }
  };

  const updateUserData = (data: { name?: string; email?: string }) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const checkSession = async () => {
    try {
      const { data } = await authClient.getSession();
      if (data?.user) {
        try {
          const fullUser = await userApi.get<User>("me");
          setUser((prevUser) => {
            if (prevUser && prevUser.id !== fullUser.id) {
              queryClient.clear();
            }
            return fullUser;
          });
        } catch {
          setUser((prevUser) => {
            if (prevUser && prevUser.id !== data.user.id) {
              queryClient.clear();
            }
            return data.user;
          });
        }
      } else {
        setUser(null);
        queryClient.clear();
      }
    } catch {
      setUser(null);
      queryClient.clear();
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    updateUserData,
    checkSession,
  };
};
