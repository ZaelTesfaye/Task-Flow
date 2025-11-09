import { useEffect, useRef, useState } from 'react';
import { LogOut, Settings, Shield, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState<'dark'|'light'>(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem('adminUser');
    if (raw) {
      const u = JSON.parse(raw) as AdminUser;
      setUser(u);
      setName(u.name || 'Admin');
      setEmail(u.email || 'admin@example.com');
    } else {
      setUser({ id: 'admin', name: 'Admin', email: 'admin@example.com', role: 'admin' });
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('disable-transitions');
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    requestAnimationFrame(() => root.classList.remove('disable-transitions'));
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <header className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-b border-[hsl(var(--border))] sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => (window.location.href = '/dashboard')}>
              TaskFlow
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-[hsl(var(--accent))]"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu((s) => !s)}
                className="flex items-center gap-3 hover:bg-[hsl(var(--accent))] rounded-lg px-3 py-2 transition"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold">{user?.name || 'Admin'}</p>
                  <p className="text-xs opacity-70">{user?.role || 'admin'}</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {(user?.name || 'A').charAt(0).toUpperCase()}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg shadow-lg border border-[hsl(var(--border))] py-2">
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[hsl(var(--accent))] flex items-center gap-3"
                  >
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <hr className="my-2 border-[hsl(var(--border))]" />
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
        </div>
      </header>

      <main>{children}</main>

      {/* Profile Modal (name/email only for now) */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProfileModal(false)}>Cancel</Button>
            <Button onClick={() => setShowProfileModal(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout confirmation */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Are you sure you want to logout?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={logout}>Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
