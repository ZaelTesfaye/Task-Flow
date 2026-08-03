import { useState, useEffect, useCallback } from "react";
import type { AdminUser } from "../types";
import { adminUserApiClient, adminApiClient } from "../lib/api-client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";
import { Shield, Users } from "lucide-react";
import {
  UserTable,
  ChangePasswordDialog,
  CreateAdminDialog,
  DeleteUserDialog,
} from "../components";

interface ApiResponse<T> {
  message?: string;
  data?: T;
}

const Dashboard = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(
    null,
  );

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminUserApiClient.get<AdminUser[] | ApiResponse<AdminUser[]>>(
        `${page}/10`,
      );

      const nextUsers = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      setUsers(nextUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const rawUser = localStorage.getItem("adminUser");
    if (rawUser) {
      try {
        setCurrentAdminUser(JSON.parse(rawUser) as AdminUser);
      } catch (error) {
        console.error("Failed to parse stored admin user:", error);
      }
    }
  }, []);

  const handleRemoveUser = async (user: AdminUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await adminUserApiClient.delete(userToDelete.id);
      toast.success("User removed successfully");
      loadUsers();
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch {
      toast.error("Failed to remove user");
    }
  };

  const handleUpdatePassword = async () => {
    if (!selectedUser || !newPassword) return;
    try {
      await adminUserApiClient.patch({
        userId: selectedUser.id,
        password: newPassword,
      });
      setSelectedUser(null);
      setNewPassword("");
      setIsDialogOpen(false);
      toast.success("Password updated successfully");
    } catch {
      toast.error("Failed to update password");
    }
  };

  const handleCreateAdmin = async () => {
    if (!adminUsername || !adminName || !adminPassword) return;
    try {
      await adminApiClient.post(
        { username: adminUsername, name: adminName, password: adminPassword },
        "create-admin",
      );
      setAdminUsername("");
      setAdminName("");
      setAdminPassword("");
      setIsCreateAdminOpen(false);
      toast.success("Admin created successfully");
      loadUsers(); // Refresh the user list
    } catch {
      toast.error("Failed to create admin");
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto space-y-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">
              Admin Dashboard
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Manage users and system settings
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          {currentAdminUser?.role === "owner" && (
            <Button
              onClick={() => setIsCreateAdminOpen(true)}
              className="text-white bg-green-600 hover:bg-green-700"
            >
              <Shield className="w-4 h-4 mr-2" />
              Create Admin
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[hsl(var(--muted-foreground))]">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{users.length}</CardContent>
        </Card>

        <Card className="border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[hsl(var(--muted-foreground))]">
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {users.filter((u) => u.role === "admin" || u.role === "owner").length}
          </CardContent>
        </Card>

        <Card className="border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[hsl(var(--muted-foreground))]">
              Standard Users
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {users.filter((u) => u.role !== "admin" && u.role !== "owner").length}
          </CardContent>
        </Card>
      </div>

      <Card className="w-full border shadow-sm bg-[hsl(var(--card))] border-[hsl(var(--border))] rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Users className="w-5 h-5 text-blue-600" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            users={users}
            loading={loading}
            currentAdminUser={currentAdminUser}
            onChangePassword={(user) => {
              setSelectedUser(user);
              setIsDialogOpen(true);
            }}
            onDeleteUser={handleRemoveUser}
          />
          <div className="flex items-center justify-between mt-6">
            <Button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              variant="outline"
              className="border-[hsl(var(--border))]"
            >
              Previous
            </Button>
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
              Page {page}
            </span>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={users.length < 10}
              variant="outline"
              className="border-[hsl(var(--border))]"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedUser={selectedUser}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        onUpdatePassword={handleUpdatePassword}
      />

      <CreateAdminDialog
        isOpen={isCreateAdminOpen}
        onClose={() => setIsCreateAdminOpen(false)}
        adminUsername={adminUsername}
        setAdminUsername={setAdminUsername}
        adminName={adminName}
        setAdminName={setAdminName}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        onCreateAdmin={handleCreateAdmin}
      />

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setUserToDelete(null);
        }}
        userToDelete={userToDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default Dashboard;
