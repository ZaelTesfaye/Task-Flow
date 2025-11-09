import React from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  if (!token) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }
  return <>{children}</>;
}
