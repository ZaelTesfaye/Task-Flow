import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

function Layout() {
  // This layout wraps protected pages with a header
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <BrowserRouter basename="/admin">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
