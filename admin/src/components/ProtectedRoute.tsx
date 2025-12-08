import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
      setIsAuthenticated(true);
    } else {
      window.location.href = "/login";
    }
    setLoading(false);
  }, []);

  if (loading) return null; // or a loading spinner
  if (!isAuthenticated) return null;

  return <Outlet />;
}
