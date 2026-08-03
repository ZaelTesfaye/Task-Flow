import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useThemeStore } from "./lib/theme-store";

function Layout() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex min-h-[calc(100vh-73px)] flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 bg-[hsl(var(--background))]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Navigate to="/users-custom" replace />} />
            <Route path="/users-custom" element={<Dashboard />} />
          </Route>
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
