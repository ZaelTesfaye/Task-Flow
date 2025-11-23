import { useEffect, useRef, useState } from "react";
import { LogOut, Shield } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export default function AdminLayout() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem("adminUser");
    if (raw) {
      const u = JSON.parse(raw) as AdminUser;
      setUser(u);
    } else {
      setUser({
        id: "admin",
        name: "Admin",
        email: "admin@example.com",
        role: "admin",
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <header className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-b border-[hsl(var(--border))] sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h1
              className="text-2xl font-bold text-blue-600 cursor-pointer dark:text-blue-400"
              onClick={() => (window.location.href = "/admin/dashboard")}
            >
              TaskFlow
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu((s) => !s)}
                className="flex items-center gap-3 px-3 py-2 transition rounded-lg hover:cursor-pointer hover:bg-gray-600"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs opacity-70">{user?.role || "admin"}</p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-blue-600 rounded-full">
                  {(user?.name || "A").charAt(0).toUpperCase()}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg shadow-lg border border-[hsl(var(--border))] py-2">
                  <hr className="my-0.5 border-[hsl(var(--border))]" />
                  <button
                    onClick={() => {
                      setShowLogoutModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center w-full gap-3 px-4 py-3 text-left hover:cursor-pointer hover:bg-gray-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* Logout confirmation */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Are you sure you want to logout?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={logout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
