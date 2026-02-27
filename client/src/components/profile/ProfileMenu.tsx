"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Trash2, Moon, Sun, Inbox, CreditCard } from "lucide-react";
import { useThemeStore } from "@/stores";
import { Switch } from "@/components";
import { User } from "@/types";

interface ProfileMenuProps {
  user: User | null;
  onEditProfile: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
  onUpgrade: () => void;
  onManageSubscription: () => void;
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
  onManageSubscription,
  isOpen,
  onClose,
  invitationsCount = 0,
}: ProfileMenuProps) {
  const { theme, setTheme } = useThemeStore();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleClickOutside = (event: MouseEvent) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, onClose]);

  const baseButtonClasses =
    "w-full px-4 py-2 text-left flex items-center gap-3 hover:cursor-pointer " +
    "hover:bg-[hsl(var(--accent))] dark:hover:bg-[hsl(var(--background))]/40";

  const getBadge = () => {
    if (!user?.stripePriceId) {
      return <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs dark:bg-gray-700">Free</span>;
    }

    // Determine if it's starter or pro based on price
    const isStarterPrice =
      user.stripePriceId.includes("starter") || user.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_ID;

    if (isStarterPrice) {
      return (
        <span className="ml-2 rounded-full bg-gray-400 px-2 py-0.5 text-xs text-white dark:bg-gray-600">Starter</span>
      );
    }

    // Pro plan
    return (
      <div className="ml-2 flex items-center gap-1.5">
        <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-xs text-white">
          Premium
        </span>
        <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">Pro</span>
      </div>
    );
  };

  // Check if user is premium
  const isPremium =
    !!user?.stripePriceId && !!user?.stripeCurrentPeriodEnd && new Date(user.stripeCurrentPeriodEnd) > new Date();

  const menuItems = [
    // Show either Upgrade or Manage Subscription based on premium status
    ...(isPremium
      ? [
          {
            label: "Manage Subscription",
            icon: <CreditCard className="h-4 w-4" />,
            onClick: onManageSubscription,
            style: "text-blue-600 dark:text-blue-400 font-medium",
          },
        ]
      : [
          {
            label: "Upgrade to Premium",
            icon: <CreditCard className="h-4 w-4" />,
            onClick: onUpgrade,
            style: "text-blue-600 dark:text-blue-400 font-medium",
          },
        ]),
    {
      label: "Edit Profile",
      icon: <Settings className="h-4 w-4" />,
      onClick: onEditProfile,
    },
    {
      label: "Delete Account",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: onDeleteAccount,
      style: "text-red-600",
    },
    {
      label: "Invitations",
      icon: <Inbox className="h-4 w-4" />,
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
          className="supports-backdrop-filter:bg-[hsla(var(--card)/0.92)] absolute right-0 mt-2 w-72 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2 text-[hsl(var(--card-foreground))] shadow-lg backdrop-blur"
        >
          <div className="mb-2 border-b border-[hsl(var(--border))] px-4 py-3">
            <div className="mb-1 flex items-center justify-between">
              <p className="truncate font-semibold">{user?.name}</p>
              {getBadge()}
            </div>
            <p className="truncate text-sm text-[hsl(var(--muted-foreground))]">{user?.email}</p>
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
                <div className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-red-500"></div>
              )}
            </button>
          ))}

          <hr className="my-2 border-gray-200 dark:border-gray-700" />

          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="text-sm">Dark Mode</span>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              className="hover:cursor-pointer"
            />
          </div>

          <hr className="my-2 border-gray-200 dark:border-gray-700" />

          <button onClick={onLogout} className={`${baseButtonClasses} `}>
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </>
  );
}
