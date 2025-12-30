"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { Crown } from "lucide-react";

import { useThemeStore } from "@/stores";
import { useAuth } from "@/context";
import { userAPI, projectAPI } from "@/lib";
import { UpdateUserRequest, ProjectInvitation } from "@/types";
import {
  ConfirmationModal,
  ProfileMenu,
  EditProfileModal,
  SubscriptionModal,
} from "./";

export default function Header() {
  const { user, logout, updateUserData, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [invitationsCount, setInvitationsCount] = useState(0);

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
              className="relative flex items-center gap-3 px-3 py-2 transition rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 hover:cursor-pointer"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center justify-end gap-1">
                  {user.name}
                  {user.stripePriceId && (
                    <Crown className="w-3 h-3 text-amber-500" />
                  )}
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
                <div className="absolute w-2 h-2 bg-red-500 rounded-full -top-1 -right-1"></div>
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
              onUpgrade={() => {
                setShowSubscriptionModal(true);
                setShowProfileMenu(false);
              }}
              isOpen={showProfileMenu}
              onClose={() => setShowProfileMenu(false)}
              invitationsCount={invitationsCount}
            />
          </div>
        </div>
      </header>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />

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
        confirmButtonColor="red"
      />
    </div>
  );
}
