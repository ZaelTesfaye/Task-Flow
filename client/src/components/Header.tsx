"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

import { useThemeStore } from "@/stores";
import { useAuth } from "@/context";
import { userAPI, projectAPI } from "@/lib";
import {
  User as UserType,
  UpdateUserRequest,
  ProjectInvitation,
} from "@/types";
import { ConfirmationModal, ProfileMenu, EditProfileModal } from "./";

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
  const [invitationsCount, setInvitationsCount] = useState(0);

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

  // Fetch invitations count
  useEffect(() => {
    const fetchInvitations = async () => {
      if (!user) return;
      try {
        const response = await projectAPI.getMyInvitations();
        const pendingInvitations = response.data.filter(
          (inv: ProjectInvitation) => inv.status === "pending"
        );
        setInvitationsCount(pendingInvitations.length);
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
      }
    };
    fetchInvitations();
  }, [user]);

  // Added useEffect to fetch pending invitations count
  useEffect(() => {
    const fetchInvitations = async () => {
      if (!user) return;
      try {
        const response = await projectAPI.getMyInvitations();
        const pendingInvitations = response.data.filter(
          (inv: ProjectInvitation) => inv.status === "pending"
        );
        setInvitationsCount(pendingInvitations.length);
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
        // Optionally show a toast or handle error, but keep dot hidden on failure
      }
    };
    fetchInvitations();
  }, [user]);

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
              className="flex items-center gap-3 hover:bg-[hsl(var(--accent))] rounded-lg px-3 py-2 transition hover:cursor-pointer relative"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                  {user.name}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-blue-600 rounded-full">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              {/* Red dot notification for invitations */}
              {invitationsCount > 0 && (
                <div className="absolute w-2 h-2 bg-red-500 border border-white rounded-full -top-1 -right-1"></div>
              )}
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
              invitationsCount={invitationsCount}
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
