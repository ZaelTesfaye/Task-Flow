import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/Login.tsx';
import App from './App.tsx';
import AdminLayout from './components/AdminLayout.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <App />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
