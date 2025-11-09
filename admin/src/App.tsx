import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn } from 'lucide-react';
import type { AdminUser } from './types';
import { adminAPI } from './lib/api';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './components/ui/dialog';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const navigate = useNavigate();

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
    const data = await adminAPI.getAllUsers(page, 10);
    console.log('Fetched users:', data);
    setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }
    loadUsers();
  }, [loadUsers, navigate]);

  const handleRemoveUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    try {
      await adminAPI.removeUser(userId);
      toast.success('User removed successfully');
      loadUsers();
    } catch {
      toast.error('Failed to remove user');
    }
  };

  const handleUpdatePassword = async () => {
    if (!selectedUser || !newPassword) return;
    try {
      await adminAPI.updateUserPassword(selectedUser.id, newPassword);
      setSelectedUser(null);
      setNewPassword('');
      setIsDialogOpen(false);
      toast.success('Password updated successfully');
    } catch {
      toast.error('Failed to update password');
    }
  };

  const handleCreateAdmin = async () => {
    if (!adminUsername || !adminName || !adminPassword) return;
    try {
      await adminAPI.createAdmin(adminUsername, adminName, adminPassword);
      setAdminUsername('');
      setAdminName('');
      setAdminPassword('');
      setIsCreateAdminOpen(false);
      toast.success('Admin created successfully');
      loadUsers(); // Refresh the user list
    } catch {
      toast.error('Failed to create admin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Toaster position="top-right" />
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage users and system settings</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => setIsCreateAdminOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Shield className="w-4 h-4 mr-2" />
              Create Admin
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogIn className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Card className="w-full bg-white border-0 shadow-lg dark:bg-gray-800 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl font-semibold text-gray-900 dark:text-white">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading users...</span>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto border border-gray-200 rounded-lg dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Name</th>
                        <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Email</th>
                        <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Role</th>
                        <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Created</th>
                        <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {user.role || 'user'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 space-x-2 text-sm whitespace-nowrap">
                            <Button
                              onClick={() => { setSelectedUser(user); setIsDialogOpen(true); }}
                              size="sm"
                              variant="outline"
                              className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
                            >
                              Change Password
                            </Button>
                            <Button
                              onClick={() => handleRemoveUser(user.id)}
                              variant="destructive"
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <Button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {page}
                  </span>
                  <Button
                    onClick={() => setPage(page + 1)}
                    disabled={users.length < 10}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-lg font-semibold">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Change Password
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Change password for <span className="font-medium text-gray-900 dark:text-white">{selectedUser?.name}</span>
              </p>
              <div>
                <Label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full"
                />
              </div>
            </div>
            <DialogFooter className="flex space-x-2">
              <Button
                onClick={() => { setSelectedUser(null); setNewPassword(''); setIsDialogOpen(false); }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={handleUpdatePassword} className="bg-blue-600 hover:bg-blue-700">
                Update Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateAdminOpen} onOpenChange={setIsCreateAdminOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-lg font-semibold">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Create New Admin
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="adminUsername" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </Label>
                <Input
                  id="adminUsername"
                  type="text"
                  value={adminUsername}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="adminName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="adminName"
                  type="text"
                  value={adminName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="adminPassword" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full"
                />
              </div>
            </div>
            <DialogFooter className="flex space-x-2">
              <Button
                onClick={() => { setAdminUsername(''); setAdminName(''); setAdminPassword(''); setIsCreateAdminOpen(false); }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAdmin} className="bg-green-600 hover:bg-green-700">
                Create Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
