"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Trash2, Moon, Sun, Inbox } from "lucide-react";
import { useThemeStore } from "@/stores";
import { Switch } from "@/components/ui";

interface ProfileMenuProps {
  user: {
    name: string;
    email: string;
  };
  onEditProfile: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  invitationsCount?: number;
}

export default function ProfileMenu({
  user,
  onEditProfile,
  onDeleteAccount,
  onLogout,
  isOpen,
  onClose,
  invitationsCount = 0,
}: ProfileMenuProps) {
  const { theme, setTheme } = useThemeStore();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // click outside to close menu
  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          ref={profileMenuRef}
          className="absolute right-0 mt-2 w-72 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg shadow-lg border border-[hsl(var(--border))] py-2 backdrop-blur supports-backdrop-filter:bg-[hsla(var(--card)/0.92)]"
        >
          <button
            onClick={onEditProfile}
            className="w-full px-4 py-2 text-left hover:bg-[hsl(var(--accent))] flex items-center gap-3 hover:cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            Edit Profile
          </button>
          <button
            onClick={onDeleteAccount}
            className="w-full px-4 py-2 text-left hover:bg-[hsl(var(--accent))] flex items-center gap-3 text-red-600 hover:cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
          <button
            onClick={() => {
              router.push("/invitations");
              onClose();
            }}
            className="w-full px-4 py-2 text-left hover:bg-[hsl(var(--accent))] flex items-center gap-3 hover:cursor-pointer relative"
          >
            <Inbox className="w-4 h-4" />
            Invitations
            {invitationsCount > 0 && (
              <div className="absolute w-2 h-2 transform -translate-y-1/2 bg-red-500 rounded-full right-4 top-1/2"></div>
            )}
          </button>
          <hr className="my-2 border-gray-200 dark:border-gray-700" />
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              <span className="text-sm">Dark Mode</span>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                checked ? setTheme("dark") : setTheme("light")
              }
              className="hover:cursor-pointer"
            />
          </div>
          <hr className="my-2 border-gray-200 dark:border-gray-700" />
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-left hover:bg-[hsl(var(--accent))] flex items-center gap-3 hover:cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </>
  );
}
