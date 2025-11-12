"use client";

import { useAuth } from "@/context/AuthContext";
import { useThemeStore } from "@/stores";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { userAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { User as UserType, UpdateUserRequest } from "@/types";
import ConfirmationModal from "./modals/ConfirmationModal";
import ProfileMenu from "./profile/ProfileMenu";
import EditProfileModal from "./profile/EditProfileModal";

export default function Header() {
  const { user, logout, updateUserData, loading } = useAuth();
  const { theme } = useThemeStore();
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("disable-transitions");
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    // Re-enable transitions on next frame
    requestAnimationFrame(() => {
      root.classList.remove("disable-transitions");
    });
  }, [theme]);

  useEffect(() => {
    if (!user && !loading && pathname !== "/auth") {
      router.push("/login");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: UpdateUserRequest = { name, email };
      const response = await userAPI.updateUser(data);
      updateUserData(response.data);
      toast.success("Profile updated successfully!");
      setShowProfileModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userAPI.deleteUser();
      toast.success("Account deleted successfully");
      logout();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-b border-[hsl(var(--border))] sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <h1
            className="text-2xl font-bold text-blue-600 cursor-pointer dark:text-blue-400 hover:cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            TaskFlow
          </h1>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 hover:bg-[hsl(var(--accent))] rounded-lg px-3 py-2 transition hover:cursor-pointer"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                  {user.name}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-blue-600 rounded-full">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </button>

            <ProfileMenu
              user={user}
              onEditProfile={() => {
                setName(user.name || "");
                setEmail(user.email || "");
                setShowProfileModal(true);
                setShowProfileMenu(false);
              }}
              onDeleteAccount={() => {
                setShowDeleteModal(true);
                setShowProfileMenu(false);
              }}
              onLogout={() => {
                setShowLogoutModal(true);
                setShowProfileMenu(false);
              }}
              isOpen={showProfileMenu}
              onClose={() => setShowProfileMenu(false)}
            />
          </div>
        </div>
      </header>

      {/* Profile Edit Modal */}
      <EditProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        name={name}
        email={email}
        onNameChange={setName}
        onEmailChange={setEmail}
        onSubmit={handleUpdateProfile}
      />

      {/* Delete Account Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Account"
        message="Are you sure you want to delete your apccount? This action cannot be undone."
        confirmText="Delete Account"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        confirmButtonColor="red"
      />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout? You'll need to sign in again to access your projects."
        confirmText="Logout"
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
        onCancel={() => setShowLogoutModal(false)}
        confirmButtonColor="blue"
      />
    </div>
  );
}
