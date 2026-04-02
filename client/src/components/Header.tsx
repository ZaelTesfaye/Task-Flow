"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

import { useAuthContext } from "@/context";
import { useAuthActions, useInvitationsCount, useProfileActions } from "@/hooks";
import type { UpdateUserRequest } from "@/types";
import { ProfileMenu, EditProfileModal, ConfirmationModal, SubscriptionModal } from "@/components";

export default function Header() {
  const { user, loading } = useAuthContext();
  const { logout } = useAuthActions();
  const {
    updateProfile: handleUpdateProfile,
    deleteAccount: handleDeleteAccount,
    manageSubscription: handleManageSubscription,
  } = useProfileActions();
  const invitationsCount = useInvitationsCount();
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [name, setName] = useState(user?.name || "");

  useEffect(() => {
    if (!user && !loading && pathname !== "/auth") {
      router.push("/login");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const onUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: UpdateUserRequest = { name };
      await handleUpdateProfile(data);
      setShowProfileModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
        <div className="flex items-center justify-between px-6 py-4">
          <h1
            className="cursor-pointer text-2xl font-bold text-blue-600 hover:cursor-pointer dark:text-blue-400"
            onClick={() => router.push("/dashboard")}
          >
            TaskFlow
          </h1>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="relative flex items-center gap-3 rounded-lg px-3 py-2 transition hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{user.name}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{user.email}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              {/* Red dot notification for invitations */}
              {invitationsCount > 0 && <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></div>}
            </button>

            <ProfileMenu
              user={user}
              onEditProfile={() => {
                setName(user.name || "");
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
              onManageSubscription={() => {
                handleManageSubscription();
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
      <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} />

      {/* Profile Edit Modal */}
      <EditProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        name={name}
        onNameChange={setName}
        onSubmit={onUpdateProfile}
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
