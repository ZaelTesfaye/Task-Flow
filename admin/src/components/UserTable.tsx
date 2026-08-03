import React from "react";
import { Button } from "./ui/button";
import type { AdminUser } from "../types";

interface UserTableProps {
  users: AdminUser[];
  loading: boolean;
  currentAdminUser: AdminUser | null;
  onChangePassword: (user: AdminUser) => void;
  onDeleteUser: (user: AdminUser) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  currentAdminUser,
  onChangePassword,
  onDeleteUser,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-[hsl(var(--muted-foreground))]">
          Loading users...
        </span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg border-[hsl(var(--border))]">
      <table className="min-w-full divide-y divide-[hsl(var(--border))]">
        <thead className="bg-[hsl(var(--secondary))]">
          <tr>
            <th className="px-6 py-4 text-xs font-medium tracking-wider text-left uppercase text-[hsl(var(--muted-foreground))]">
              Name
            </th>
            <th className="px-6 py-4 text-xs font-medium tracking-wider text-left uppercase text-[hsl(var(--muted-foreground))]">
              Email
            </th>
            <th className="px-6 py-4 text-xs font-medium tracking-wider text-left uppercase text-[hsl(var(--muted-foreground))]">
              Role
            </th>
            <th className="px-6 py-4 text-xs font-medium tracking-wider text-left uppercase text-[hsl(var(--muted-foreground))]">
              Created
            </th>
            <th className="px-6 py-4 pl-10 text-xs font-medium tracking-wider text-left uppercase text-[hsl(var(--muted-foreground))]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y bg-[hsl(var(--card))] divide-[hsl(var(--border))]">
          {users.map((user) => {
            const canDelete =
              user.role !== "owner" &&
              (user.role !== "admin" || currentAdminUser?.role === "owner");

            return (
              <tr
                key={user.id}
                className="transition-colors hover:bg-[hsl(var(--accent))]"
              >
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-[hsl(var(--muted-foreground))]">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin" || user.role === "owner"
                        ? "bg-blue-500/15 text-blue-500"
                        : "bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))]"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-[hsl(var(--muted-foreground))]">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 space-x-2 text-sm whitespace-nowrap">
                  <Button
                    onClick={() => onChangePassword(user)}
                    size="sm"
                    variant="link"
                    className="text-blue-600"
                  >
                    Change Password
                  </Button>
                  {canDelete && (
                    <Button
                      onClick={() => onDeleteUser(user)}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
