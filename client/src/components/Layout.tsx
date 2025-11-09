import { useAuth } from '@/context/AuthContext';
import { useThemeStore } from '@/stores';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { LogOut, Settings, Trash2, Moon, Sun, Inbox } from 'lucide-react';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { User as UserType, UpdateUserRequest } from '@/types/api';
import { Switch } from '@/components/ui/switch';
import ConfirmationModal from './ConfirmationModal';
import Modal from './Modal';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, updateUserData, loading } = useAuth();
  const { theme, toggleTheme, setTheme } = useThemeStore();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Ensure <html> has the correct theme class at runtime as a safety net
  useEffect(() => {
    const root = document.documentElement;
    // Temporarily disable transitions to prevent flicker while switching theme
    root.classList.add('disable-transitions');
    // Remove both theme classes first to avoid intermediate mixed states
    root.classList.remove('dark', 'light');
    root.classList.add(theme); // theme is either 'dark' or 'light'
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    // Re-enable transitions on next frame
    requestAnimationFrame(() => {
      root.classList.remove('disable-transitions');
    });
  }, [theme]);

  useEffect(() => {
    if (!user && !loading && router.pathname !== '/login' && router.pathname !== '/register') {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  // Show loading state while user is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render anything if no user (will redirect to login)
  if (!user) {
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: UpdateUserRequest = { name, email };
      const response = await userAPI.updateUser(data);
      updateUserData(response.data);
      toast.success('Profile updated successfully!');
      setShowProfileModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userAPI.deleteUser();
      toast.success('Account deleted successfully');
      logout();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
    {/* Header */}
    <header className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-b border-[hsl(var(--border))] sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => router.push('/dashboard')}>
            TaskFlow
          </h1>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 hover:bg-[hsl(var(--accent))] rounded-lg px-3 py-2 transition"
            >
              <div className="text-right">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs opacity-70">{user.role}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </button>

            {showProfileMenu && (
              <div ref={profileMenuRef} className="absolute right-0 mt-2 w-72 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg shadow-lg border border-[hsl(var(--border))] py-2 backdrop-blur supports-backdrop-filter:bg-[hsla(var(--card)/0.92)]">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs opacity-70 mb-1">Your User ID</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
                      {user.id}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(user.id);
                        toast.success('User ID copied!');
                      }}
                      className="text-xs text-[hsl(var(--primary))] hover:brightness-110 font-medium"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setName(user.name || '');
                    setEmail(user.email || '');
                    setShowProfileModal(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-[hsl(var(--accent))] flex items-center gap-3"
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-[hsl(var(--accent))] flex items-center gap-3 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
                <button
                  onClick={() => {
                    router.push('/invitations');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-[hsl(var(--accent))] flex items-center gap-3"
                >
                  <Inbox className="w-4 h-4" />
                  Invitations
                </button>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <div className="px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    <span className="text-sm">Dark Mode</span>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => (checked ? setTheme('dark') : setTheme('light'))}
                  />
                </div>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={() => {
                    setShowLogoutModal(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-[hsl(var(--accent))] flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Profile Edit Modal */}
      <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)}>
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-[hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none bg-[hsl(var(--input))] text-[hsl(var(--foreground))]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none bg-[hsl(var(--input))] text-[hsl(var(--foreground))]"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="flex-1 px-4 py-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg hover:brightness-110 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
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