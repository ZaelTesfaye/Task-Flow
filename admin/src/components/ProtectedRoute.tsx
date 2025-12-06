import { Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }
  return <Outlet />;
}
