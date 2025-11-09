import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { adminAPI } from '../lib/api';
import toast, { Toaster } from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await adminAPI.login(email, password);
      localStorage.setItem('adminToken', response.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Toaster position="top-right" />
      <div className="w-full max-w-md p-8 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-600 rounded-full">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Portal</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to access the admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="text"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="admin@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Secure admin access only
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;