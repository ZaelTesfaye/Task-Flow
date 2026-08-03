import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { authApiClient } from "../lib/api-client";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const adminUser = localStorage.getItem("adminUser");
      if (!adminUser) {
        setShouldRedirect(true);
        setLoading(false);
        return;
      }

      try {
        const session = await authApiClient.get<{ user: { role?: string } | null }>(
          "get-session",
        );
        if (session.user?.role === "admin" || session.user?.role === "owner") {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("adminUser");
          setShouldRedirect(true);
        }
      } catch {
        localStorage.removeItem("adminUser");
        setShouldRedirect(true);
      } finally {
        setLoading(false);
      }
    };

    void checkSession();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <div className="text-sm opacity-80">Checking admin session...</div>
      </div>
    );
  }

  if (shouldRedirect || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
