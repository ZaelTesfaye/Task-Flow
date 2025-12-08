import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data?.user) {
          setIsAuthenticated(true);
        } else {
          window.location.href = "/login";
        }
      } catch {
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) return null; // or a loading spinner
  if (!isAuthenticated) return null;

  return <Outlet />;
}
