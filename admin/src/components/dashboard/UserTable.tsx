import React from "react";
import { Button } from "../ui/button";
import type { AdminUser } from "../../types";

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
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading users...
        </span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
              Name
            </th>
            <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
              Email
            </th>
            <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
              Role
            </th>
            <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
              Created
            </th>
            <th className="px-6 py-4 pl-10 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {users.map((user) => {
            const canDelete =
              user.role !== "owner" &&
              (user.role !== "admin" || currentAdminUser?.role === "owner");

            return (
              <tr
                key={user.id}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin" || user.role === "owner"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
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
