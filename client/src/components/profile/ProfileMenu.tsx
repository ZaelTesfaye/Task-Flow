"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Settings,
  Trash2,
  Moon,
  Sun,
  Inbox,
  CreditCard,
  Crown,
} from "lucide-react";
import { useThemeStore } from "@/stores";
import { Switch } from "@/components/ui";
import { User } from "@/types";

interface ProfileMenuProps {
  user: User | null;
  onEditProfile: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
  onUpgrade: () => void;
  isOpen: boolean;
  onClose: () => void;
  invitationsCount?: number;
}

export default function ProfileMenu({
  user,
  onEditProfile,
  onDeleteAccount,
  onLogout,
  onUpgrade,
  isOpen,
  onClose,
  invitationsCount = 0,
}: ProfileMenuProps) {
  const { theme, setTheme } = useThemeStore();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const baseButtonClasses =
    "w-full px-4 py-2 text-left flex items-center gap-3 hover:cursor-pointer " +
    "hover:bg-[hsl(var(--accent))] dark:hover:bg-[hsl(var(--background))]/40";

  const getBadge = () => {
    if (!user?.stripePriceId) {
      return (
        <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full ml-2">
          Free
        </span>
      );
    }
    return (
      <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 ml-2">
        <Crown className="w-3 h-3" /> Premium
      </span>
    );
  };

  const menuItems = [
    {
      label: "Upgrade to Premium",
      icon: <CreditCard className="w-4 h-4" />,
      onClick: onUpgrade,
      style: "text-blue-600 dark:text-blue-400 font-medium",
    },
    {
      label: "Edit Profile",
      icon: <Settings className="w-4 h-4" />,
      onClick: onEditProfile,
    },
    {
      label: "Delete Account",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: onDeleteAccount,
      style: "text-red-600",
    },
    {
      label: "Invitations",
      icon: <Inbox className="w-4 h-4" />,
      onClick: () => {
        router.push("/invitations");
        onClose();
      },
      style: "relative",
      notificationDot: invitationsCount > 0,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          ref={profileMenuRef}
          className="absolute right-0 mt-2 w-72 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg shadow-lg border border-[hsl(var(--border))] py-2 backdrop-blur supports-backdrop-filter:bg-[hsla(var(--card)/0.92)]"
        >
          <div className="px-4 py-3 border-b border-[hsl(var(--border))] mb-2">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold truncate">{user?.name}</p>
              {getBadge()}
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] truncate">
              {user?.email}
            </p>
          </div>

          {menuItems.map((menuItem) => (
            <button
              key={menuItem.label}
              onClick={menuItem.onClick}
              className={`${baseButtonClasses} ${menuItem.style || ""}`}
            >
              {menuItem.icon}
              {menuItem.label}
              {menuItem.notificationDot && (
                <div className="absolute w-2 h-2 transform -translate-y-1/2 bg-red-500 rounded-full right-4 top-1/2"></div>
              )}
            </button>
          ))}

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
                setTheme(checked ? "dark" : "light")
              }
              className="hover:cursor-pointer"
            />
          </div>

          <hr className="my-2 border-gray-200 dark:border-gray-700" />

          <button onClick={onLogout} className={`${baseButtonClasses} `}>
            <LogOut className="w-4 h-4 " />
            Logout
          </button>
        </div>
      )}
    </>
  );
}
