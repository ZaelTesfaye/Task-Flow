"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { authClient } from "@/lib/auth-client";
import { userClient } from "@/lib";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  stripePriceId?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripeCurrentPeriodEnd?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial session check mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data?.user) {
          try {
            const fullUser = await userClient.get<User>("me");
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

    initSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
