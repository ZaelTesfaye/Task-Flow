import { useAuthContext } from "@/context";
import { authClient } from "@/lib/auth-client";
import { userAPI } from "@/lib";

export const useAuthActions = () => {
  const { setUser, setLoading } = useAuthContext();

  const login = async (data: { email: string; password: string }) => {
    const { data: result } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result?.user) {
      setUser(result.user);
    } else {
      throw new Error("Login failed");
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    const { data: result } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    // Send verification email
    await authClient.sendVerificationEmail({ email: data.email });

    // User is created but not signed in until verified
    return result;
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
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
          const fullUser = await userAPI.get("me");
          setUser(fullUser);
        } catch (err) {
          console.error("Failed to fetch full user profile:", err);
          setUser(data.user);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
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
